import * as React from 'react';
import { useState , useEffect} from 'react';
import "./Post.css";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'

const MenuPopupState = (props) => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
  const [disabled, setDisabled] = useState(false);

  useEffect(()=>{
    if(props.user===null){
      setDisabled(true);
    }else{
      setDisabled(false);
    }
  },[props.user]);

  return (
    <div>
      <MoreVertIcon variant="contained" {...bindTrigger(popupState)}  aria-controls="fade-menu" aria-haspopup="true" />
      <Menu {...bindMenu(popupState)}>
        {(disabled) ? 
        <MenuItem disabled={disabled}>
          <span>{props.labeltopass}</span>
        </MenuItem> : 
        <MenuItem onClick={popupState.close}>
          <span onClick={props.functiontopass.bind(this, props.datatopass)}>{props.labeltopass}</span>
        </MenuItem>
      }
        {
          props.topmenu && (
            (props.topmenu && props.user) ? (
              <MenuItem onClick={popupState.close}>
                <span onClick={props.signout}>{props.signoutlabel}</span>
              </MenuItem>
            ) : (
              <div>
                <MenuItem onClick={popupState.close}>
                  <span onClick={props.signin}>{props.signinlabel}</span>
                </MenuItem>
                <MenuItem onClick={popupState.close}>
                  <span onClick={props.signup}>{props.signuplabel}</span>
                </MenuItem>
              </div>
            )
          )
        }
        <MenuItem onClick={popupState.close}>
          <span><strong>{"CANCEL"}</strong></span>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MenuPopupState;