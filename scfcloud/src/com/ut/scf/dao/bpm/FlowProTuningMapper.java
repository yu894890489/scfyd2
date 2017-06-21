package com.ut.scf.dao.bpm;

import java.util.List;
import java.util.Map;

import com.ut.scf.core.dict.PageInfoBean;

public interface FlowProTuningMapper {
    
	List<Map<String, Object>> selectFlowProTuning(Map<String, Object> paramMap, PageInfoBean page);
    
	List<Map<String, Object>> selectFlowProTuning(Map<String, Object> paramMap);
	
	int insertFlowProTuning(Map<String, Object> paramMap);

	int deleteFlowProTuning(String rskctId);

	int updateFlowProTuning(Map<String, Object> paramMap);
	
	int countProjectName(Map<String, Object> paramMap);
}