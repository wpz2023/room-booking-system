export function changeClasstypeName(classType: Map<string, string>) {
  const type = classType.get("pl");
  if (type == "Wykład") {
    classType.set("pl", "WYK");
  } else if (type == "Ćwiczenia") {
    classType.set("pl", "CW");
  } else if (type == "Konwersatorium") {
    classType.set("pl", "KON");
  } else if (type == "Laboratorium") {
    classType.set("pl", "LAB");
  } else if (type == "Seminarium") {
    classType.set("pl", "SEM");
  } else if (type == "Pracownia") {
    classType.set("pl", "PRA");
  } else if (type == "Pracownia komputerowa") {
    classType.set("pl", "PKO");
  } else if (type == "Lektorat") {
    classType.set("pl", "LEK");
  } else if (type == "Warsztat") {
    classType.set("pl", "WAR");
  }
  return classType;
}
