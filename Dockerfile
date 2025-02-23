# 1️⃣ Build-Stage: Gradle verwendet zum Kompilieren der Anwendung
FROM gradle:8.12.1-jdk17 AS build
WORKDIR /app

# Gradle-Wrapper und alle Projektdateien kopieren
COPY --chown=gradle:gradle . .

# Erstelle das Boot-JAR (verhindert das erneute Laden von Abhängigkeiten)
RUN ./gradlew bootJar --no-daemon

# 2️⃣ Runtime-Stage: Nur das fertige JAR wird verwendet
FROM openjdk:17-jdk-slim
WORKDIR /app

# Kopiere das fertige JAR aus der Build-Stage
COPY --from=build /app/build/libs/*.jar app.jar

# Setze Umgebungsvariablen für Spring Boot
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# Starte die Anwendung
CMD ["java", "-jar", "app.jar"]