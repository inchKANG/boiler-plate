import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom';

function RegisterPage(props) {

    const dispatch = useDispatch();
    //usestate를 통해 쉽게 자동완성. useState 안에는 기본값 입력
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Name, setName] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");


    const onEmailHandler=(event)=>{

        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler=(event)=>{
        setPassword(event.currentTarget.value);
    };

    const onNameHandler=(event)=>{
        setName(event.currentTarget.value);
    };
    const onConfirmPasswordHandler=(event)=>{
        setConfirmPassword(event.currentTarget.value);
    };
    


    const onSubmitHandler=(event)=>{
        //이걸 입력해줘야 페이지가 리프레쉬 되지 않음.
        event.preventDefault();
        
        const body={
            email:Email,
            password:Password,
            name:Name,
        }
        if(Password !==ConfirmPassword){
            alert("비밀번호확인을 잘못 입력하였습니다.");
            return;
        }
       
        dispatch(registerUser(body))
        .then(response=>{
            if(response.payload.success){
                props.history.push('/login');
                return;
            }
            
            alert("가입에 실패하였습니다.");
            
        });


       
    }

    return (
        <div style = {
            {
                display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',width:'100%'
            }
        }>
            <form style={{display:'flex',flexDirection:'column'}}
            onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} required />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} required />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} required />
                <label>ConfirmPassword</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} required />
                <br />
                <button>
                    Register
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage);
