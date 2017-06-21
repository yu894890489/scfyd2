package com.ut.scf.reqbean.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "TX")
@XmlAccessorType(XmlAccessType.FIELD)
public class BaseQueryReqBean extends BaseReqXmlBean {
	private static final long serialVersionUID = 1L;

	@XmlElement(name = "TX_INFO")
	private BaseInfoReqXmlBean bean;

	public BaseInfoReqXmlBean getBean() {
		return bean;
	}

	public void setBean(BaseInfoReqXmlBean bean) {
		this.bean = bean;
	}
}
