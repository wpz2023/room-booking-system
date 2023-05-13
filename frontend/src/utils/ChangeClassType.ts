export function changeClasstypeName({
  classType,
}: {
  classType: Map<string, string>;
}) {
  if (classType.get("pl") == "Wykład") {
    classType.set("pl", "WYK");
  } else if (classType.get("pl") == "Ćwiczenia") {
    classType.set("pl", "CW");
  } else if (classType.get("pl") == "Konwersatorium") {
    classType.set("pl", "KON");
  } else if (classType.get("pl") == "Laboratorium") {
    classType.set("pl", "LAB");
  } else if (classType.get("pl") == "Seminarium") {
    classType.set("pl", "SEM");
  } else if (classType.get("pl") == "Pracownia") {
    classType.set("pl", "PRA");
  } else if (classType.get("pl") == "Pracownia komputerowa") {
    classType.set("pl", "PKO");
  } else if (classType.get("pl") == "Lektorat") {
    classType.set("pl", "LEK");
  } else if (classType.get("pl") == "Warsztat") {
    classType.set("pl", "WAR");
  }
  return classType;
}
