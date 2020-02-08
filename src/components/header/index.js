import React from 'react'
import {
  Button,
  Position,
  Popover,
  Menu,
  MenuItem,
} from "@blueprintjs/core";
import {
  Route,
} from 'react-router-dom'

import styles from './header.module.css'
import * as constants from '../../constants'

export default ({ model = ({ payload: {} }), }) => {
  return (
    <div className={styles.header}>
      <Popover content={createMenu()} position={Position.LEFT_TOP}>
        <Button icon="menu" />
      </Popover>
    </div>
  );
};

function createMenu() {
  const onClick = (history, url) => () => history.push(url);

  return (
    <Route render={({ history }) => (
      <Menu>
        {constants.years.map(year => (
          <MenuItem icon={'home'} text={year} onClick={onClick(history, `/${year}`)} />
        ))}
      </Menu>
    )}>
    </Route>
  );
}
