# Backend

## Otworzenie projektu.

Jeśli pracujecie w intellij i pobieracie całe repo to wchodzicie w pom i klikacie opcje link maven project.

Jak to macie zrobione to wtedy po prawej stronie powinno wam się pojawić zakładka maven. Wchodzicie i klikacie kręcącą
się strzałkę. To zaciąga dependencje.

Tam też można zrobić w room-booking-system>lifecycle install. Który buduje wam paczkę (też uruchamia testy w
międzyczasie).

Uruchamianie z intellij > wchodzicie w klasę RoomBookingSystemApplication i klikacie zieloną strzałkę.

Wymagana java 17.

Jak chcecie to z cmd budować to musicie mieć globalnie javę 17 a do tego potem robicie na

- linux

  `./mvnw clean install`

  `./mvnw spring-boot:run`

- windows:

  `mvnw.cmd clean install`

  `mvnw.cmd spring-boot:run`

