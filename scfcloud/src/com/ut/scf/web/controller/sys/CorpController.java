package com.ut.scf.web.controller.sys;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ut.scf.core.dict.ErrorCodeEnum;
import com.ut.scf.core.dict.ScfConsts;
import com.ut.scf.reqbean.sys.CorpAddReqBean;
import com.ut.scf.reqbean.sys.CorpDeleteReqBean;
import com.ut.scf.reqbean.sys.CorpListReqBean;
import com.ut.scf.reqbean.sys.CorpUpdateReqBean;
import com.ut.scf.respbean.BaseRespBean;
import com.ut.scf.service.sys.ICorpService;
import com.ut.scf.web.controller.BaseJsonController;

/**
 * 企业操作相关的控制类
 * 
 * @author zyx
 *
 */
@Controller
@RequestMapping("/corp")
public class CorpController extends BaseJsonController {

	private static final Logger log = LoggerFactory
			.getLogger(CorpController.class);

	@Resource
	private ICorpService corpService;

	@RequestMapping(value = "/add", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean corpAdd(HttpSession httpSession,@Valid @RequestBody CorpAddReqBean reqBean,
			BindingResult bindingResult) throws IOException {
		
		// 获取用户信息
		String corpIdSession = (String) httpSession
				.getAttribute(ScfConsts.SESSION_CORP_ID);
		log.debug("corpIdSession: {}", corpIdSession);
		String userIdSession = (String) httpSession
				.getAttribute(ScfConsts.SESSION_USER_ID);
		log.debug("userIdSession: {}", userIdSession);
		String roleIdSession = (String) httpSession
				.getAttribute(ScfConsts.SESSION_ROLE_ID);
		log.debug("roleIdSession: {}", roleIdSession);
		int roleTypeSession = (int) httpSession
				.getAttribute(ScfConsts.SESSION_ROLE_TYPE);
		log.debug("roleTypeSession: {}", roleTypeSession);
		// 保理商类型新增
//		if (roleTypeSession == ScfBizConsts.ROLE_TYPE_FACTOR) {
//			if (!roleIdSession.equals(ScfBizConsts.ROLE_ID_FACTOR_ADMIN)) {
//				reqBean.setCreateUserId(userIdSession);
//			}
//		} 
		BaseRespBean respBean = new BaseRespBean();
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}
		respBean = this.corpService.addCorpInfo(reqBean);

		return respBean;
	}

	@RequestMapping(value = "/mod", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean corpUpdate(@Valid @RequestBody CorpUpdateReqBean reqBean,
			BindingResult bindingResult) throws IOException {
		BaseRespBean respBean = new BaseRespBean();
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}

		respBean = this.corpService.updateCorp(reqBean);

		return respBean;
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean corpDelete(@Valid @RequestBody CorpDeleteReqBean reqBean,
			BindingResult bindingResult) throws IOException {
		BaseRespBean respBean = new BaseRespBean();
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}

		respBean = this.corpService.deleteCorp(reqBean);

		return respBean;
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean list(HttpSession httpSession,
			@Valid @RequestBody CorpListReqBean reqBean,
			BindingResult bindingResult) throws IOException {
		
		BaseRespBean respBean = new BaseRespBean();
		String userIdSession = (String) httpSession.getAttribute(ScfConsts.SESSION_USER_ID);
		log.debug("userIdSession: {}", userIdSession);
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}
		respBean = this.corpService.corpList(reqBean);

		return respBean;
	}

	@RequestMapping(value = "/supplierlist", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean supplierlist(HttpSession httpSession,
			@Valid @RequestBody CorpListReqBean reqBean,
			BindingResult bindingResult) throws IOException {
		
		BaseRespBean respBean = new BaseRespBean();
		String userIdSession = (String) httpSession.getAttribute(ScfConsts.SESSION_USER_ID);
		log.debug("userIdSession: {}", userIdSession);
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}
		respBean = this.corpService.supplierInfoList(reqBean);

		return respBean;
	}
	
	@RequestMapping(value = "/enterpriselist", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean coreEnterpriselist(HttpSession httpSession,
			@Valid @RequestBody CorpListReqBean reqBean, BindingResult bindingResult) throws IOException {
		
		BaseRespBean respBean = new BaseRespBean();
		String userIdSession = (String) httpSession.getAttribute(ScfConsts.SESSION_USER_ID);
		log.debug("userIdSession: {}", userIdSession);
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}
		respBean = this.corpService.enterpriseInfoList(reqBean);

		return respBean;
	}
	
	@RequestMapping(value = "/assetPackageList", method = RequestMethod.POST, consumes = { "application/json" }, produces = { "application/json;charset=UTF-8" })
	public @ResponseBody BaseRespBean corpPackagelist(HttpSession httpSession,
			@Valid @RequestBody CorpListReqBean reqBean, BindingResult bindingResult) throws IOException {
		
		BaseRespBean respBean = new BaseRespBean();
		String userIdSession = (String) httpSession.getAttribute(ScfConsts.SESSION_USER_ID);
		log.debug("userIdSession: {}", userIdSession);
		if (bindingResult.hasErrors()) {
			log.warn("bindingResult has error");
			respBean.setResult(ErrorCodeEnum.PARAM_VALID_ERROR);
			respBean.setResultErrorMap(bindingResult);
			return respBean;
		}
		respBean = this.corpService.packageInfoList(reqBean);

		return respBean;
	}
}
