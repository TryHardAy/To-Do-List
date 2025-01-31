# To-Do-List
Projekt składa się z frontendu, gdzie posiadamy pliki html, css, javascript, nginx.conf i Dockerfile
Frontend odpowiada za wyświetlanie strony pod adresem "localhost:8080", do komunikacji z backendem używam funkcji fetch() w js

Backend składa się z pliku python, requirements.txt i Dockerfile
W pliku app.py znajduje się cała logika do pobierania danych z bazy danych i wysyłania ich do strony internetowej, komunikuje
się on ze stroną za pomocą FastAPI, w pliku requirements.txt są zawarte wszystkie biblioteki python które muszą być pobrane 
do prawidłowego funkcjonowania app.py

Baza Danych składa się z pliku sql i Dockerfile
W pliku init.sql znajduje się skrypt do tworzenia bazy danych i tabelki, jeżeli takowa nie istnieje

W pliku docker-compose.yml cały projekt łączy się i jest dodatkowo konfigurowalny
Do uruchomianie projektu jest potrzebny Docker i uruchamiamy będąc w katalogu projektu i wpisując w terminalu 
docker compose up
