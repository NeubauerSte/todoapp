# Basis-Image für Java
FROM openjdk:17-jdk-slim

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten auflösen und das JAR-Build ins Image kopieren
COPY build/libs/*.jar app.jar

# Port für das Backend
EXPOSE 8080

# Startbefehl für Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]


