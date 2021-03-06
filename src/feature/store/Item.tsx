/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable key-spacing */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Modal,
  Button,
  Snackbar,
  createStyles,
  Fade,
} from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '..';
import { serverHttp } from '../common/utils';
import { userLoginActions } from '../usersignin/userloginService';

interface Item {
  _id: string;
  image: string;
  price: number;
  item_name: string;
  category: any;
}
interface IProp {
  item: Item;
  state: string;
  goToLoginPage: Function;
}
function Alert(props: AlertProps) {
  return <MuiAlert elevation={3} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 100,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9,
      marginTop: '30',
      borderBottom: '1px solid #e0e0e0',
    },
    paper: (darkmode: any) => ({
      position: 'absolute',
      width: 200,
      backgroundColor: darkmode.dark
        ? '#888888'
        : theme.palette.background.paper,
      color: darkmode.dark ? '#e0e0e0' : 'black',
      borderRadius: '5px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outlineStyle: 'none',
      textAlign: 'center',
      display: 'inline',
    }),
    modalRoot: {
      flexGrow: 1,
      transform: 'translateZ(0)',
      '@media all and (-ms-high-contrast: none)': {
        display: 'none',
      },
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: (darkmode: any) => ({
      padding: 0,
      marging: 0,
      textAlign: 'center',
      backgroundColor: darkmode.dark
        ? '#888888'
        : theme.palette.background.paper,
    }),
    info: {
      fontSize: '8px',
    },
    itemName: (darkmode: any) => ({
      color: darkmode.dark ? '#e0e0e0' : 'black',
    }),
  }),
);

const Item: React.FC<IProp> = ({ item, state, goToLoginPage }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.userLogin.accessToken);
  const user = useSelector((state: RootState) => state.userLogin.user);

  const rootRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [, setTarget] = useState<string | null>('');
  const [isCreditEnough, setIsCreditEnough] = useState(false);
  const [isAdapt, setIsAdapt] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dark = user?.darkmode;
  const darkmode = {
    dark,
  };
  const classes = useStyles(darkmode);
  const handleOpen = (targetItem: string | null) => {
    setTarget(targetItem);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsAdapt(false);
  };
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const targetItem = e.currentTarget.childNodes[1].textContent;
    handleOpen(targetItem);
  };
  const PurchaseItem = async () => {
    try {
      await axios.post(`${serverHttp}/items/purchase`, null, {
        params: {
          id: item._id,
        },
        headers: {
          Authorization: token,
        },
      });
      dispatch(
        userLoginActions.setUser({
          user: {
            ...user,
            items: {
              ...user?.items,
              [item.category]: [...user?.items[item.category], item],
            },
            credits: user!.credits - item.price,
          },
        }),
      );
    } catch (error) {
      if (!error.response) {
        setError('error occurred, please try again.');
        handleOpenSnackbar();
        return;
      }
      const {
        response: { status },
      } = error;
      if (status === 401) {
        setError('로그인 유효기간이 만료되었습니다. 다시 로그인해주세요.');
        handleOpenSnackbar();
        setTimeout(() => goToLoginPage(), 3100);
      } else {
        setError('error occurred, please try again.');
        handleOpenSnackbar();
      }
    } finally {
      setIsAdapt(false);
    }
  };
  const activeItem = async () => {
    try {
      await axios.post(`${serverHttp}/items/active`, null, {
        params: {
          id: item._id,
        },
        headers: {
          Authorization: token,
        },
      });
      dispatch(
        userLoginActions.setUser({
          user: {
            ...user,
            active: {
              ...user?.active,
              [item.category]: item,
            },
          },
        }),
      );
    } catch (error) {
      if (!error.response) {
        setError('error occurred, please try again.');
        setOpenSnackbar(true);
        return;
      }
      const {
        response: { status },
      } = error;
      if (status === 401) {
        setError('로그인 유효기간이 만료되었습니다. 다시 로그인해주세요.');
        setOpenSnackbar(true);
        setTimeout(() => goToLoginPage(), 3100);
      } else {
        setError('error occurred, please try again.');
        setOpenSnackbar(true);
      }
    } finally {
      setIsAdapt(false);
    }
  };
  const handlePurchase = (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { id },
    } = e;
    if (id === 'purchase') {
      if (item.price > user!.credits) {
        setIsCreditEnough(true);
        setTimeout(() => {
          setIsCreditEnough(false);
        }, 2500);
        return;
      }
      PurchaseItem();
    }
    handleClose();
  };
  const adaptItem = () => {
    activeItem();
  };
  const openAdaptModal = () => setIsAdapt(true);
  return (
    <>
      <div>
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={item.image} />
          <CardContent className={classes.cardContent}>
            <Typography
              variant="body2"
              color="textSecondary"
              component="h5"
              className={classes.itemName}
            >
              {item.item_name}
            </Typography>
            {state === 'active' ? (
              <Button type="button" variant="contained" disabled>
                적용됨
              </Button>
            ) : state === 'purchased' ? (
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={openAdaptModal}
              >
                구매함
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                구매
              </Button>
            )}
          </CardContent>
        </Card>

        <div className={classes.modalRoot}>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={isAdapt}
            onClose={handleClose}
            className={classes.modal}
            container={() => rootRef.current}
          >
            <Fade in={isAdapt}>
              <div className={classes.paper}>
                <h3 id="simple-modal-title">{item.category}</h3>
                <p id="simple-modal-description">{item.item_name}</p>
                <p>적용하시겠습니까?</p>
                <Button color="primary" id="adaptItem" onClick={adaptItem}>
                  Yes
                </Button>
                <Button color="secondary" id="cancel" onClick={handleClose}>
                  No
                </Button>
              </div>
            </Fade>
          </Modal>
        </div>
        <div className={classes.modalRoot}>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
            className={classes.modal}
            container={() => rootRef.current}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <h3 id="simple-modal-title">{item.category}</h3>
                <p id="simple-modal-description">{item.item_name}</p>
                <h5>
                  <span>price : </span>
                  {item.price}
                </h5>
                <p>구매 하시겠습니까?</p>
                <Button color="primary" id="purchase" onClick={handlePurchase}>
                  Yes
                </Button>
                <Button color="secondary" id="cancel" onClick={handlePurchase}>
                  No
                </Button>
                {isCreditEnough ? (
                  <div className={classes.info}>크레딧이 부족합니다!</div>
                ) : null}
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Item;
