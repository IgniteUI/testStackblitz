import * as React from "react";
import { any, string } from 'prop-types';

export class SharedComponent
    extends React.Component<any, IComponentState> {

    constructor(props: any) {
        super(props);

        this.state = { componentVisible: true }
    }
}

export interface IComponentState
{
    componentVisible?: boolean,

    data?: any[],
    legend?: any,
    selectedLabel?: string
};