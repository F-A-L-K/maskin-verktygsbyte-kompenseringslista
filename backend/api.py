#!/usr/bin/env python3
"""
Flask API for AdamBox integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to Python path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import read_adambox_value

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

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
    print("API will be available at: http://localhost:8000")
    print("Endpoints:")
    print("  GET /api/adambox?ip=<ip_address> - Get AdamBox value")
    print("  GET /health - Health check")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
