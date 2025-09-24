# -------- Stage 1: Build the JAR --------
    FROM maven:3.9.6-eclipse-temurin-17 AS build
    WORKDIR /app
    
    # Copy pom.xml and source code
    COPY backend/pom.xml .
    COPY backend/src ./src
    
    # Build the application without tests
    RUN mvn -q -DskipTests package
    
    # -------- Stage 2: Run the JAR --------
    FROM eclipse-temurin:17-jre-alpine
    WORKDIR /app
    
    # Copy JAR from build stage
    COPY --from=build /app/target/*.jar app.jar
    
    # Expose Spring Boot default port
    EXPOSE 8080
    
    # Run the application
    ENTRYPOINT ["java","-jar","/app/app.jar"]
    