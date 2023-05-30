FROM maven:3.9.2-amazoncorretto-17-debian

RUN mkdir backend
WORKDIR backend

COPY . ./backend

WORKDIR backend

RUN mvn clean install -Dmaven.test.skip=true

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]