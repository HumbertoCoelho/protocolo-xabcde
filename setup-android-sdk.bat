@echo off
echo Configurando variaveis de ambiente...
set ANDROID_HOME=C:\Android
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools

echo Aceitando licencas do Android SDK...
sdkmanager --licenses --sdk_root=%ANDROID_HOME%

echo Instalando componentes necessarios...
sdkmanager --sdk_root=%ANDROID_HOME% "platform-tools" "platforms;android-33" "build-tools;33.0.0"

echo Instalando Bubblewrap...
npm install -g @bubblewrap/cli

echo Configuracao concluida!
echo Para verificar a instalacao, digite: bubblewrap --version
