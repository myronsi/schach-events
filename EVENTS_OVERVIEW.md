# Events Management System - Übersicht

## Neue Hauptfunktionen

### 📋 **EventsList - Hauptseite**
Die neue Hauptseite (`/dashboard` oder `/events`) zeigt alle Ereignisse in einer übersichtlichen Liste:

- **Vollständige Ereignisliste** mit allen Details
- **Individuelle Bearbeitung** - Klick auf "Bearbeiten" für Inline-Editing
- **Individuelles Löschen** - Klick auf "Löschen" mit Bestätigung
- **Farbkodierung** nach Ereignistyp (Training, Turnier, Meeting, etc.)
- **Responsive Design** - funktioniert auf Desktop und Mobile

### 🔧 **Erweiterte Backend-API**

Das PHP-Backend unterstützt jetzt:
- **Event IDs** - Automatische eindeutige Kennungen für jedes Ereignis
- **Individuelle Operationen** - Bearbeiten/Löschen einzelner Events per ID
- **Bulk-Operationen** - Weiterhin verfügbar für Massenänderungen

### 🎯 **Neue API Endpunkte**

```bash
# Einzelnes Event bearbeiten
POST https://viserix.com/events.php?action=edit
Body: { "id": "event123", "title": "Neuer Titel", "time": "19:00" }

# Einzelnes Event löschen  
POST https://viserix.com/events.php?action=delete
Body: { "id": "event123" }

# Bulk-Bearbeitung (alle zukünftigen Events mit Titel)
POST https://viserix.com/events.php?action=editByTitle
Body: { "title": "Vereinsabend", "updates": { "time": "19:00" } }
```

## 🚀 **Benutzererfahrung**

### **Workflow:**
1. **Anmelden** → Automatische Weiterleitung zur Ereignisliste
2. **Ereignisse ansehen** → Übersichtliche Karten mit allen Details
3. **Bearbeiten** → Inline-Editing direkt in der Liste
4. **Erstellen** → Button "Neues Ereignis" oder separate Seite
5. **Löschen** → Bestätigungsdialog für Sicherheit

### **Features:**
- ✅ **Sofortige Änderungen** - Speichern und sofort sichtbar
- ✅ **Bestätigungen** - Sicherheitsabfragen beim Löschen
- ✅ **Visuelles Feedback** - Farbkodierung und Icons
- ✅ **Mobile-freundlich** - Responsive Design
- ✅ **FTP Upload** - Automatisches Hochladen nach Änderungen

## 📁 **Dateien Struktur**

```
src/pages/
├── EventsList.tsx          # Neue Hauptseite (Liste aller Events)
├── Login.tsx               # Anmeldung
└── events/
    ├── CreateEvent.tsx     # Neues Ereignis erstellen
    ├── EditEvents.tsx      # Bulk-Bearbeitung nach Titel
    └── DeleteEvents.tsx    # Bulk-Löschung

server/
└── events.php             # Erweiterte API mit ID-Support
```

## 🔄 **Migration von alter Version**

Vorhandene Events werden automatisch mit IDs versehen beim ersten Speichern. Keine Datenverluste.

## 🎨 **UI Verbesserungen**

- **Ereignistyp-Farben:**
  - Training: Blau
  - Turnier: Grün  
  - Meeting: Gelb
  - Special: Violett
  - Standard: Grau

- **Icons:** Kalender, Uhr, Ort für bessere Übersicht
- **Responsive Cards:** Automatische Anpassung an Bildschirmgröße