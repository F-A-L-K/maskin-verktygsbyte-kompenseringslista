#!/usr/bin/env python3
"""
Start the AdamBox API server
"""

import subprocess
import sys
import os

def main():
    print("Starting AdamBox API Server...")
    print("=" * 40)
    
    # Check if requirements are installed
    try:
        import flask
        import flask_cors
        print("✓ Dependencies found")
    except ImportError:
        print("Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Dependencies installed")
    
    # Start the API server
    print("\nStarting Flask API server...")
    print("API will be available at: http://localhost:8000")
    print("Press Ctrl+C to stop the server")
    print("=" * 40)
    
    try:
        subprocess.run([sys.executable, "api.py"])
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    main()
