# Brief Design Notes

## 1. Overview
This project is a scratch to win kiosk game designed for a tablet screen or larger. It has gameplay rules, weighted prizes, session is timed, and persistant tracking. It was built with as a full-stack application.
- Frontend: React (Vite) and an HTML Canvas
- Backend: .NET 8 Web API
- Database: EF Core + SQLite

## 2. Architectural Approach
The backend was setup so each class is testable and independent from eachother.
- Controllers handle HTTP transport only.
- Services contain business rules and gameplay logic.
- Repositories abstract data persistence.
- EF Core manages database interaction.

## 3. Prize Selection Logic
A cumulative weighted distribution model was used for selecting prizes.

## 4. Session Hendling
UTC timestamps were used to keep track of the session time and enforse 5 min of play.

## 5. Scratch Card Design
HTML Canvas and destinatino-out was used to keep track of surface "scratched" and after 45% the prize is revield and the session timer begins. 

## 6. Improvements
Persistance was implemented but a once per liftime prize logic was not configured.
Depoiment on a Docer container to have the app fully running.
Create additional views for Attract Screen, Session Timed Out and Plays used.
Create a confety effect after prize is won.