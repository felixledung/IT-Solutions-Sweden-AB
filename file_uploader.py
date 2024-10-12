import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Mappen där uppladdade filer sparas
UPLOAD_FOLDER = 'documents'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

# Skapa mappen om den inte finns
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return '.' in filename and filename.rsplit(
        '.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/documents', methods=['GET'])
def get_documents():
    try:
        files = os.listdir(UPLOAD_FOLDER)
        return jsonify(files)  # Returnera listan som JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Ingen fil skickades!'}), 400
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = file.filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({'success': True, 'filename': filename}), 201
    return jsonify({'error': 'Felaktig filtyp!'}), 400


@app.route('/documents/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)