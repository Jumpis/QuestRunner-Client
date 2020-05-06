import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Theme, createStyles, makeStyles, useTheme,
} from '@material-ui/core/styles';
import NavBar from '../navbar/NavBar';
import ExBarAvatar from '../experiencebar/ExBarAvatar';
import ExperienceBar from '../experiencebar/ExperienceBar';
import Image from '../../img/rgana.jpg';


const useStyles = makeStyles((theme: Theme) => createStyles({
  bg: {
    backgroundImage: `url(${Image})`,
  },
}));


const MainPage: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.bg}
      container
      direction="column"
      justify="flex-end"
      alignItems="stretch"
    >
      <NavBar />
      <ExBarAvatar />
      <ExperienceBar />
    </Grid>
  );
};
export default MainPage;
