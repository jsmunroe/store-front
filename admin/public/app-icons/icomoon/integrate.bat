@echo off

xcopy fonts\icomoon.eot ..\fonts\icons.eot /y
xcopy fonts\icomoon.svg ..\fonts\icons.svg /y
xcopy fonts\icomoon.ttf ..\fonts\icons.ttf /y
xcopy fonts\icomoon.woff ..\fonts\icons.woff /y

powershell -Command "(gc style.css) -replace 'icomoon', 'icons' | Out-File -encoding ASCII ..\icons.css"

rmdir /s /Q demo-files
rmdir /s /Q  fonts
del demo.html
del "Read Me.txt"
del selection.json
del style.css

pause