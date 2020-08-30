import 'whatwg-fetch'
import { message } from 'antd'
import {isAuthenticated, logout} from '../utils/session'
import history from './history'

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

/**
 * 处理url
 * @param url
 * @param param
 * @returns {*}
 */
function handleURL(url, param) {
    let completeUrl = '';
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    if (param) {
        if (completeUrl.indexOf('?') === -1) {
            completeUrl = `${completeUrl}?${ObjToURLString(param)}`
        } else {
            completeUrl = `${completeUrl}&${ObjToURLString(param)}`
        }
    }
    return completeUrl
}

function handleUrl(url) {
    let completeUrl = '';
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 * @constructor
 */
function ObjToURLString(param) {
    let str = '';
    if (Object.prototype.toString.call(param) === '[object Object]') {
        const list = Object.entries(param).map(item => {
            return `${item[0]}=${item[1]}`
        });
        str = list.join('&')
    }
    return str
}

//获取
export async function get(url, param) {
    const completeUrl = handleURL(url, param);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            xhrFields: {
                withCredentials: true       //跨域
            },
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
        });
    }else{
        response = await fetch(completeUrl, {
            credentials: 'include',
            xhrFields: {
                withCredentials: true       //跨域
            }
        });
    }
    const reslut = await response.json();
    if (!response.ok) {
        if(response.status === 200){
            if (reslut.code !== 0){
                message.error(reslut.msg || '网络错误');
            }
        }else{
            if (response.status === 403 || response.status ===401){
                if (reslut.message || reslut.code === 401){
                    logout();
                    history.push('/login');
                    message.error('登录失效')
                }else{
                    message.error(reslut.msg || '网络错误')
                }
            }
        }
    }
    return reslut

}

//提交
export async function post(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    }else{
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(param)
        });
    }
    const reslut = await response.json();
    if (!response.ok) {
        if(response.status === 200){
            if (reslut.code !== 0){
                message.error(reslut.msg || '网络错误')
            }
        }else{
            if (response.status === 403){
                if (reslut.message){
                    logout();
                    history.push('/login');
                    message.error('登录失效')
                }else{
                    message.error(reslut.msg || '网络错误')
                }
            }
        }
    }
    return reslut
}

//patch修改
export async function patch(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()){
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PATCH",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    } else{
        const response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PATCH",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(param)
        });
    }
    const reslut = await response.json();
    if (!response.ok) {
        if(response.status === 200){
            if (reslut.code !== 0){
                message.error(reslut.msg || '网络错误')
            }
        }else{
            if (response.status === 403){
                if (reslut.message){
                    logout();
                    history.push('/login');
                    message.error('登录失效')
                }else{
                    message.error(reslut.msg || '网络错误')
                }
            }
        }
    }
    return reslut
}

//put修改
export async function put(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()){
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    } else{
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(param)
        });
    }
    const reslut = await response.json();
    if (!response.ok) {
        if(response.status === 200){
            if (reslut.code !== 0){
                message.error(reslut.msg || '网络错误')
            }
        }else{
            if (response.status === 403){
                if (reslut.message){
                    logout();
                    history.push('/login');
                    message.error('登录失效')
                }else{
                    message.error(reslut.msg || '网络错误')
                }
            }
        }
    }
    return reslut
}


//删除
export async function del(url, param) {
    const completeUrl = handleURL(url, param);
    let response;
    if (isAuthenticated()){
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'delete',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
        });
    } else{
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'delete',
            xhrFields: {
                withCredentials: true
            }
        });
    }
    const reslut = await response.json();
    if (!response.ok) {
        if(response.status === 200){
            if (reslut.code !== 0){
                message.error(reslut.msg || '网络错误')
            }
        }else{
            if (response.status === 403){
                if (reslut.message){
                    logout();
                    history.push('/login');
                    message.error('登录失效')
                }else{
                    message.error(reslut.msg || '网络错误')
                }
            }
        }
    }
    return reslut
}

