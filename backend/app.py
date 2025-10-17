#!/usr/bin/env python3
"""
Flask API for AdamBox integration
All backend functionality in one file
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import struct
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

def read_adambox_value(ip_address, port=502, unit_id=1, register_address=2):
    """
    Read a single value from AdamBox
    
    Args:
        ip_address (str): IP address of the AdamBox
        port (int): Modbus TCP port (default: 502)
        unit_id (int): Modbus unit ID (default: 1)
        register_address (int): Register address to read (default: 2)
    
    Returns:
        dict: Result with value or error
    """
    socket_obj = None
    
    try:
        # Create socket connection
        socket_obj = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket_obj.settimeout(10)
        socket_obj.connect((ip_address, port))
        
        # Build Modbus TCP request
        transaction_id = 1
        protocol_id = 0
        length = 6
        function_code = 3  # Read Holding Registers
        
        request = struct.pack('>HHHBBHH',
            transaction_id,
            protocol_id,
            length,
            unit_id,
            function_code,
            register_address,
            1  # Read 1 register
        )
        
        # Send request
        socket_obj.send(request)
        
        # Receive response
        response = socket_obj.recv(1024)
        
        if len(response) < 8:
            return {
                "error": f"Response too short: {len(response)} bytes",
                "timestamp": datetime.now().isoformat()
            }
        
        # Parse response header
        (t_id, p_id, l_id, u_id, f_code) = struct.unpack('>HHHBB', response[:8])
        
        # Check for Modbus exception
        if f_code & 0x80:
            exception_code = response[8] if len(response) > 8 else 0
            return {
                "error": f"Modbus exception: function code {f_code & 0x7F}, exception {exception_code}",
                "timestamp": datetime.now().isoformat()
            }
        
        if f_code != 3:
            return {
                "error": f"Unexpected function code: {f_code}",
                "timestamp": datetime.now().isoformat()
            }
        
        # Get byte count and value
        if len(response) < 9:
            return {
                "error": "Response too short for data",
                "timestamp": datetime.now().isoformat()
            }
        
        byte_count = response[8]
        
        if len(response) < 9 + byte_count:
            return {
                "error": f"Response too short: expected {9 + byte_count} bytes, got {len(response)}",
                "timestamp": datetime.now().isoformat()
            }
        
        # Extract register value
        value = struct.unpack('>H', response[9:11])[0]
        
        return {
            "ip_address": ip_address,
            "register_address": register_address,
            "value": value,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
        
    except socket.timeout:
        return {
            "error": "Connection timeout",
            "timestamp": datetime.now().isoformat()
        }
    except ConnectionRefusedError:
        return {
            "error": "Connection refused - check if AdamBox is running",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
    finally:
        if socket_obj:
            socket_obj.close()

# API Routes

@app.route('/api/adambox', methods=['GET'])
def get_adambox_value():
    """
    Get AdamBox value for a specific IP address
    Query parameters:
    - ip: IP address of the AdamBox
    """
    ip_address = request.args.get('ip')
    
    if not ip_address:
        return jsonify({
            "error": "IP address parameter is required",
            "status": "error"
        }), 400
    
    # Read value from AdamBox
    result = read_adambox_value(ip_address)
    
    if "error" in result:
        return jsonify(result), 500
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "AdamBox API"
    })

if __name__ == '__main__':
    print("Starting AdamBox API server...")
    print("=" * 40)
    print("API will be available at: http://localhost:8000")
    print("\nEndpoints:")
    print("  GET /api/adambox?ip=<ip_address> - Get AdamBox value")
    print("  GET /health - Health check")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)
    
    app.run(host='0.0.0.0', port=8000, debug=True)
