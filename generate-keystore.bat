@echo off
echo Generating keystore...
"C:\Program Files\jdk-23.0.1\bin\keytool" -genkey -v ^
    -keystore protocolo-xabcde.keystore ^
    -alias protocolo-xabcde ^
    -keyalg RSA ^
    -keysize 2048 ^
    -validity 10000 ^
    -storepass protocolo123 ^
    -keypass protocolo123 ^
    -dname "CN=Protocolo XABCDE, OU=Development, O=Protocolo XABCDE, L=Unknown, ST=Unknown, C=BR"
