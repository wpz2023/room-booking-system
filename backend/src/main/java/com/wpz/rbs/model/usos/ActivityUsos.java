package com.wpz.rbs.model.usos;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityUsos {

    @JsonProperty("type")
    public String type;

    @JsonProperty("start_time")
    public String start_time;

    @JsonProperty("end_time")
    public String end_time;

    @JsonProperty("name")
    public Map<String,String> name;

    @JsonProperty("url")
    public String url;

    @JsonProperty
    public Map<String,String> course_name;

    @JsonProperty("classtype_name")
    public Map<String,String> classtype_name;

    @JsonProperty("lecturer_ids")
    public List<Integer> lecturer_ids;
}