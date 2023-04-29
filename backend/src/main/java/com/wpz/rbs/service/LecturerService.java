package com.wpz.rbs.service;

import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.repository.LecturerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LecturerService {

    private final LecturerRepository lecturerRepository;

    public LecturerService(LecturerRepository lecturerRepository) {
        this.lecturerRepository = lecturerRepository;
    }

    public List<Lecturer> getAll() {
        List<Lecturer> lecturers = new ArrayList<>();
        lecturerRepository.findAll().forEach(lecturers::add);
        return lecturers;
    }

    public Lecturer getById(String id) {
        return lecturerRepository.findById(id).orElse(null);
    }

    public Optional<Lecturer> getByIdOptional(String id) {
        return lecturerRepository.findById(id);
    }

    public Lecturer saveOrUpdate(Lecturer lecturer) {
        return lecturerRepository.save(lecturer);
    }
}
