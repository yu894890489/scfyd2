package com.ut.scf.reqbean.bpm;

import com.ut.scf.reqbean.BaseReqBean;

/**
 * @author jihang
 *	flow_project查询
 */
public class FlowProjectAddReqBean extends BaseReqBean{
	  
		/**
		 * 企业Id
		 */
		private String corpId;
	    /**
	     * 项目名称
	     */
	    private String projectName;

	    private String apId;
	    /**
	     * 创建者Id
	     */
	    private String createUserId;

	    
	    /**
	     * 授信方式：0首笔，1增额，2置换续期，3循环额度，4其他
	     */
	    private Byte creditMode;

	    
	    /**
	     * 项目状态：0已立项，1已尽调，2已审核，3已签署,4已放款,5资产包
	     */
	    private Byte proStatus;


		public String getCorpId() {
			return corpId;
		}


		public void setCorpId(String corpId) {
			this.corpId = corpId;
		}


		public String getProjectName() {
			return projectName;
		}


		public void setProjectName(String projectName) {
			this.projectName = projectName;
		}


		public String getCreateUserId() {
			return createUserId;
		}


		public void setCreateUserId(String createUserId) {
			this.createUserId = createUserId;
		}


		public Byte getCreditMode() {
			return creditMode;
		}


		public void setCreditMode(Byte creditMode) {
			this.creditMode = creditMode;
		}


		public Byte getProStatus() {
			return proStatus;
		}


		public void setProStatus(Byte proStatus) {
			this.proStatus = proStatus;
		}


		public String getApId() {
			return apId;
		}


		public void setApId(String apId) {
			this.apId = apId;
		}
	    
	    
}
