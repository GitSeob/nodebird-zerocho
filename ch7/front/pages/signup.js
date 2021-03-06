import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { signUpRequestAction, SIGN_UP_REQUEST } from '../reducers/user';
import Router from 'next/router'

// const TextInput = ({ value, onChange}) => {
//     return (
//         <Input name="user-id" value={value} required onChange={onChange} />
//     )
// }
// 
// TextInput.proptypes = {
//     value: Proptypes.string,
// }
// 위는 너무 지나친 최적화

export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue)
    const handler = useCallback((e) =>{
        setter(e.target.value)
    }, [])
    return [value, handler]
}

const Signup = () => {
    const [passwordChk, setPasswordChk] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [termError, setTermError] = useState(false)
    const dispatch = useDispatch()
    const [id, onChangeId] = useInput('')
    const [nickname, onChangeNickname] = useInput('')
    const [password, onChangePassword] = useInput('')
    const { isSigningUp, me } = useSelector(state=>state.user)

    useEffect(()=>{
        if(me){
            alert('로그인했으니 메인페이지로 이동합니다.')
            Router.push('/')
        }
    }, [me && me.id])

    const onSubmit = useCallback((e) =>{
        e.preventDefault()
        if(password !== passwordChk) {
            return setPasswordError(true)
        }
        if(!term){ 
            return setTermError(true)
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userId: id,
                password,
                nickname
            }
        })
    }, [id, nickname, password, passwordChk, term])


    const onChangePasswordChk = useCallback((e) => {
        setPasswordError(e.target.value !== password)
        setPasswordChk(e.target.value)
    }, [password])

    const onChangeTerm = useCallback((e) => {
        setTermError(false)
        setTerm(e.target.checked)
    }, [])
 
    if(me){
        return null
    }
    return (
        <>
            <Form onSubmit={onSubmit}>
                <div style = {{ margin: 10}}>
                    <label htmlFor="user-id">아이디</label>
                    <br />
                    <Input name="user-id" value={id} required onChange={onChangeId} />
                </div>
                <div style = {{ margin: 10}}>
                    <label htmlFor="user-nickname" >닉네임</label>
                    <br />
                    <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
                </div>
                <div style = {{ margin: 10}}>
                    <label htmlFor="user-password" >비밀번호</label>
                    <br />
                    <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
                </div>
                <div style = {{ margin: 10}}>
                    <label htmlFor="user-password-chk" >비밀번호확인</label>
                    <br />
                    <Input name="user-password-chk" type="password" value={passwordChk} required onChange={onChangePasswordChk}/>
                    {passwordError && <div style={{ color:'red'}}>비밀번호가 일치하지 않습니다. </div>}
                </div>
                <div style = {{ margin: 10}}>
                    <Checkbox name="user-term" value={term} onChange={onChangeTerm}>약관에 동의합니다.</Checkbox>
                    {termError && <div style={{ color:'red'}}>약관에 동의해야합니다.</div>}
                </div>
                <div style={{ margin:10 }}>
                    <Button type="primary" htmlType="submit" loading={isSigningUp}>{isSigningUp?'':'가입하기'}</Button>
                </div>
            </Form>
        </>
    );
};


export default Signup;