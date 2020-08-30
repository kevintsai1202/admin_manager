import React from 'react'
import {get} from "../utils/ajax";

// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER';
export const SET_WELCOME = 'SET_WELCOME';
export const SET_MENUS = 'SET_MENUS';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
}
function setWelcome(data) {
    return {
        type: SET_WELCOME,
        statistic: data
    }
}
function setMenus(data) {
    return {
        type: SET_MENUS,
        menus: data
    }
}
//异步action，从后台获取用户信息
export function getUser() {
    return async function (dispatch) {
        const res = await get('/session');
        dispatch(setUser(res.data || {}))
    }
}
//首页统计数据获取
export function getWelcome() {
    return async function (dispatch) {
        const res = await get('/welcome');
        dispatch(setWelcome(res.data || {}))
    }
}
//加载菜单
export function initMenus() {
    return async function (dispatch) {
        const res = await get('/menu');
        dispatch(setMenus(res.data || {}))
    }
}

