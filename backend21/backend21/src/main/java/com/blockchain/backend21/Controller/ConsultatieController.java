package com.blockchain.backend21.Controller;

import com.blockchain.backend21.Dto.ConsultatieDto;
import com.blockchain.backend21.Dto.ConsultatiiTimePeriodDto;
import com.blockchain.backend21.Model.Consultatie;
import com.blockchain.backend21.Model.Patient;
import com.blockchain.backend21.Service.ConsultatieService;
import com.blockchain.backend21.Service.PatientService;
import com.blockchain.backend21.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ResourceBundle;


@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path ="/api")
public class ConsultatieController {

    private final PatientService patientService;
    private final ConsultatieService consultatieService;

    @Autowired
    public ConsultatieController(PatientService patientService, ConsultatieService consultatieService) {
        this.patientService = patientService;
        this.consultatieService = consultatieService;
    }

    @PostMapping("/consult/add")
    //@PreAuthorize("hasAnyAuthority('MEDIC')")
    public ResponseEntity<ApiResponse> createNewConsult(@RequestBody ConsultatieDto dto) {
        consultatieService.addConsultatie(dto);
        return ResponseEntity.ok(ApiResponse.success("New consult Created", null));
    }

    @GetMapping("/consult/patient/{cnp}")
    public ResponseEntity<ApiResponse> getAllPatientConsults(@RequestParam String cnp) {
        List<Consultatie> consultatii = consultatieService.getConsultatiiByCnp(cnp);
        return ResponseEntity.ok(ApiResponse.success("Consultatiile pacientului", consultatii));
    }

    @GetMapping("/consult/date")
    public ResponseEntity<ApiResponse> getConsults(@RequestBody ConsultatiiTimePeriodDto consultatiiTimePeriodDto) {
        List<Consultatie> consultatii = consultatieService.getConsultatiiByPeriod(consultatiiTimePeriodDto.startTime, consultatiiTimePeriodDto.endTime);
        return ResponseEntity.ok(ApiResponse.success("Consultatiile din anumite perioade", consultatii));
    }

    @GetMapping("/consult/patient_date/{cnp}")
    public ResponseEntity<ApiResponse>getPatientConsultsDate(@PathVariable String cnp, @RequestBody ConsultatiiTimePeriodDto consultatiiTimePeriodDto) {
        List<Consultatie> consultatii  = consultatieService.getConsultatiiByCnpAndPeriod(cnp,  consultatiiTimePeriodDto.startTime, consultatiiTimePeriodDto.endTime);
        return ResponseEntity.ok(ApiResponse.success("Consutatiile pacientului din numita perioda", consultatii));

    }

}
