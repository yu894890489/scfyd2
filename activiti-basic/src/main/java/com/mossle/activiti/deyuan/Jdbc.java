package com.mossle.activiti.deyuan;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Jdbc {
	private static String url;
	private static String driver;
	private static ThreadLocal<Connection> tl = new ThreadLocal<Connection>();
	static {
		url = Utils.getInstance().getValue("url");
		driver = Utils.getInstance().getValue("driver");
	}
	static {
		try {
			Class.forName(driver);
		} catch (ClassNotFoundException e) {
			System.out.println("找不到驱动类");
			e.printStackTrace();
		}
	}

	/**
	 * 原方法
	 * @return
	 */
	public static Connection getMySqlConnectionbak() {
		Connection conn = tl.get();
		if (conn == null) {
			try {
				conn = DriverManager.getConnection(url);
				tl.set(conn);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return conn;
	}
	
	public static Connection getMySqlConnection() {
		Connection conn = null;
		if (conn == null) {
			try {
				conn = DriverManager.getConnection(url);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return conn;
	}

	public static void close(ResultSet rs) {
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException e) {
			}
		}
	}

	public static void close(Statement pst) {
		if (pst != null) {
			try {
				pst.close();
			} catch (SQLException e) {
			}
		}
	}

	public static void close(Connection conn) {
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	public static void begin() {
		Connection conn = getMySqlConnection();
		try {
			conn.setAutoCommit(false);
		} catch (SQLException e) {
		}
	}

	public static void commit() {
		Connection conn = getMySqlConnection();
		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void rollback() {
		Connection conn = getMySqlConnection();
		try {
			conn.rollback();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public static void closeConnection() {
		Connection conn = getMySqlConnection();
		Jdbc.close(conn);
		tl.remove();
	}
}