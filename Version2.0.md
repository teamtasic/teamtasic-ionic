# Version 2.0 Plan:

## Neu struckturieren:

- AuthAccount kann mehrere `UserAccount`s haben:
  - `UserAccount` hat keine Loginpasswörter
  - Hat einen Anzeigenamen
  - Hat eine Telefonnummer, Adresse, Email und Notfallkontakt
  - Hat Mitgliedschaften (Max. 4):
    - Referenziert ein Teamchat
    - Referenziert einen Verein
    - Hat eine Rolle
- Vereine:
  - Verein hat einen Namen
  - Verein hat Mitgliedschaften
  - Verein hat eine Adresse
  - Verein hat eine Telefonnummer
  - Verein hat eine Email
  - Verein hat Mitglieder
  - Teams:
    - Team hat einen Namen
    - Team hat Mitgliedschaften:
      - Hat eine Rolle

## Organisation in Chats:

- Vorteil: einfacheres Interface
- Nachteil: todarbeitung von jesse
- Ein `UserAccount` kann in der Toolbar ausgewählt werden, dann wird nur Inhalt für diesen einen `UserAccount` angezeigt
- Jedes Team hat einen Chat, in diesem kann nach "NUR-TERMINE" gefiltert werden, es kann aber auch gleich direkt zu Terminen komentiert werden. (Auch mit Dateien, z.B. Spielpläne oder Anmeldungen)
- Die Einladung in Chats erfolgt via Link. Nach dem Anmelden wird ein `UserAccount` ausgewählt, der dann in der Chat eingeladen wird. Ein Administrator muss dabei den Benutzer in das Team annehemen.

## Interface:

- Not-Logged-In:
  - Login
  - Registrieren
  - Passwort vergessen
- Logged-In:
  - Tab1: **Kontakte**:
    Zeigt alle UserAccounts an, mit denen der aktuelle Benutzer in Kontakt gekommmen ist, z.B. Teamkameraden aber für Trainer einfach alle Mitglieder.
    - Kontakt hinzufügen
    - Kontakt löschen
    - Kontakt bearbeiten
  - Tab2: **Chats**:
    Zeigt alle Chats an, in denen der aktuell ausgewählte `UserAccount` eingeladen wurde.
    - Chat hinzufügen
    - Chat löschen
    - Chat bearbeiten
  - Tab3: **Vereine**:
    Hier leben die Admintools für die Vereine.
    - Verein hinzufügen
    - Verein löschen
    - Verein bearbeiten
  - Tab4: **Einstellungen**:
    Hier kann der aktuelle Benutzer seine Daten bearbeiten.
    - Benutzer bearbeiten
    - Passwort ändern
    - Email ändern
    - Telefonnummer ändern
    - `UserAccount`s bearbeiten

## Screens:

- PRE-LOGIN
  - Login
  - Registrieren
  - PW vergessen
- POST-LOGIN
  - Kontakte
    - KontaktView
    - KontaktBearbeiten
  - Chats
    - ChatView
    - ChatDetails
    - AddEvent
    - EditEvent
  - Vereine
    - Meine Vereine
    - Verein erstellen
    - Verein bearbeiten
  - Einstellungen
    - Ich
    - Passwort ändern
    - Email ändern

## Database:
📦🪧📄
- 📦 `AuthAccounts`:
  ```JSON
  {
    "username": string,
    "email": string,
    "adress": string,
    "city": string,
    "phone": string,

  }
  ```
  - 📦 `UserAccounts`:
    ```JSON
    {
      "name": string,
      "emergencyPhone": string,
      "phone": string,
    }
    ```
    - 📦 `Memberships`:
      Max. 5 Memberships, every club max. once
      ```JSON
      {
        "club": clubId,
        "team": teamId,
        "role": enum<role>
      }
      ```