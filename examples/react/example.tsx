// @ts-nocheck
import React, { FC } from 'react';
import { BrowserRoute } from 'react-router-dom';

import App from 'antd';
import thirdParty from 'third-party';

import otherthing from '@core/otherthing';

import component from '@ui/hello';

import threeLevelRelativePath from '../../../threeLevelRelativePath';
import twoLevelRelativePath from '../../twoLevelRelativePath';
import oneLevelRelativePath from '../oneLevelRelativePath';
import sameLevelRelativePath from './sameLevelRelativePath';

export { random } from './random';

interface HelloWorldProps {
    name: string;
}

const HelloWorld: FC<HelloWorldProps> = ({ name }) => {
    return <div>Hello, {name}</div>;
};

export default HelloWorld;
