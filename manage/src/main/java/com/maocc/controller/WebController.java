package com.maocc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author maocc
 * @description
 * @date: 2019/3/27 19:49
 */
@Controller
public class WebController {
	@RequestMapping("/index")
	public String index() {
		return "index";
	}
}
