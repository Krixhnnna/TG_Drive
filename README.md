# TG Drive - Telegram Cloud Storage

A modern cloud storage solution built with Telegram as the backend storage provider. This project allows users to store and manage their files using Telegram's infrastructure.

## Features

- Telegram authentication
- File upload and management
- Folder organization
- File sharing
- Favorites system
- Trash management
- Storage statistics
- Modern and responsive UI

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- Pyrogram (Telegram Client)
- SQLite

### Frontend
- React
- Material-UI
- React Router
- Axios
- React Dropzone

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3. Telegram Configuration

1. Create a Telegram group named "TG Drive Backup"
2. Add your bot as admin to the group
3. Get the group ID and update GROUP_ID in main.py
4. Set your bot's domain with BotFather: /setdomain yourdomain.com
5. Update bot username in Login component

### 4. Environment Variables

Create .env file in backend:

```
API_ID=your_api_id
API_HASH=your_api_hash
BOT_TOKEN=your_bot_token
GROUP_ID=your_group_id
```

## Project Structure

```
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. # TG_Drive
# TG_Drive
