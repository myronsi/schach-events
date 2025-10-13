# Simple PHP Events API

## Single File Setup

Upload `events.php` to your web server at `https://viserix.com/events.php`

## API Usage

All operations use the same URL with different `action` parameters:

### Get Events
```bash
GET https://viserix.com/events.php?action=list
```

### Create Event
```bash
POST https://viserix.com/events.php?action=create
Body: { "title": "Event Name", "date": "2025-10-15", "time": "18:00" }
```

### Edit Future Events by Title
```bash
POST https://viserix.com/events.php?action=edit
Body: { "title": "Event Name", "updates": { "time": "19:00", "location": "New Location" } }
```

### Delete Events
```bash
POST https://viserix.com/events.php?action=delete
Body: { "mode": "upcomingTitle", "title": "Event Name" }
```

## Environment File

Create `.env` next to `events.php` for FTP upload:
```
FTP_HOST=ftp.example.com
FTP_USER=username
FTP_PASS=password
FTP_PORT=21
```

## Frontend

The frontend now calls:
- `https://viserix.com/events.php?action=create` for creating
- `https://viserix.com/events.php?action=edit` for editing  
- `https://viserix.com/events.php?action=delete` for deleting

## Files Created

- `server/events.php` - Single PHP file handling all operations
- Updated frontend files to use simple API calls

## Test Locally

```bash
cd server/
php -S localhost:8000
# Then test: http://localhost:8000/events.php?action=list
```