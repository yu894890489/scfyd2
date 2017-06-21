package com.ut.scf.service.crm.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ut.scf.core.dict.ErrorCodeEnum;
import com.ut.scf.core.dict.PageInfoBean;
import com.ut.scf.core.util.ScfUUID;
import com.ut.scf.dao.crm.IExternalGuaranteeDao;
import com.ut.scf.respbean.BaseRespBean;
import com.ut.scf.respbean.PageRespBean;
import com.ut.scf.service.crm.IExternalGuaranteeService;

@Service("externalGuaranteeService")
public class ExternalGuaranteeServiceImpl implements IExternalGuaranteeService{
	private static final Logger log = LoggerFactory
			.getLogger(ExternalGuaranteeServiceImpl.class);

	@Resource
	private IExternalGuaranteeDao externalGuaranteeDao;

	@Override
	@Transactional(readOnly = true)
	public BaseRespBean getExternalGuaranteeList(Map<String ,Object> paramMap, PageInfoBean page) {
		List<Map<String, Object>> list = externalGuaranteeDao.selectExternalGuaranteeList(paramMap,page);
		PageRespBean respBean = new PageRespBean();
		respBean.setPages(page.getTotalPage());
		respBean.setRecords(page.getTotalRecord());
		respBean.setDataList(list);
		log.info("**********list:"+list);
		return respBean;
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public BaseRespBean addExternalGuarantee(Map<String ,Object> paramMap) {
		
		BaseRespBean respBean = new BaseRespBean();

		// 生成主键Id
		paramMap.put("recUid", ScfUUID.generate());
		int insertNum = externalGuaranteeDao.insert(paramMap);
		log.debug("insert ExternalGuarantee num {}", insertNum);
		if (insertNum <= 0) {
			respBean.setResult(ErrorCodeEnum.ADD_FAILED);
			return respBean;
		}

		return respBean;
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public BaseRespBean updateExternalGuarantee(Map<String ,Object> paramMap) {
		BaseRespBean respBean = new BaseRespBean();

		int updateNum = externalGuaranteeDao.updateByPrimaryKeySelective(paramMap);
		log.debug("update ExternalGuarantee num {}", updateNum);
		if (updateNum <= 0) {
			respBean.setResult(ErrorCodeEnum.UPDATE_FAILED);
			return respBean;
		}
		return respBean;
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public BaseRespBean deleteExternalGuarantee(String recUid) {
		BaseRespBean respBean = new BaseRespBean();

		int deleteNum = externalGuaranteeDao.deleteByPrimaryKey(recUid);
		log.debug("delete ExternalGuarantee num {}", deleteNum);
		if (deleteNum <= 0) {
			respBean.setResult(ErrorCodeEnum.DELETE_FAILED);
			return respBean;
		}

		return respBean;
	}
}
