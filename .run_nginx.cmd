@ECHO OFF
SET NGFOLDER=D:\PROGRAM_FILES\nginx-1.8.0\
CD %NGFOLDER%

ECHO root %~dp0/; > %NGFOLDER%conf\custom.conf
tasklist /fi "imagename eq nginx.exe" | find /C "nginx.exe" > nul
REM EXIST logs/nginx.pid
IF %errorlevel% EQU 0 (
	start %NGFOLDER%nginx.exe -s reload
) else (
	start %NGFOLDER%nginx.exe
)
CD %~dp0
ping -n 1 localhost > nul
tasklist /fi "imagename eq nginx.exe"
pause