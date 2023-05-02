export function changeClasstypeName(classType: Map<string, string>){
    if (classType["pl"]=="Wykład"){
        classType["pl"] = "WYK"
    } else if (classType["pl"]=="Ćwiczenia"){
        classType["pl"] =  "CW"
    } else if (classType["pl"]=="Konwersatorium"){
        classType["pl"] = "KON"
    } else if (classType["pl"]=="Laboratorium"){
        classType["pl"] = "LAB"
    } else if (classType["pl"]=="Seminarium"){
        classType["pl"] = "SEM"
    } else if (classType["pl"]=="Pracownia"){
        classType["pl"] = "PRA"
    } else if (classType["pl"]=="Pracownia komputerowa"){
        classType["pl"] = "PKO"
    } else if (classType["pl"]=="Lektorat"){
        classType["pl"] = "LEK"
    } else if (classType["pl"]=="Warsztat"){
        classType["pl"] = "WAR"
    }
    return classType;
}