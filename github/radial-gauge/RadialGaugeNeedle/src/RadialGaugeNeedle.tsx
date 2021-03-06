import { IgrRadialGauge } from 'igniteui-react-gauges';
import { IgrRadialGaugeModule } from 'igniteui-react-gauges';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";

IgrRadialGaugeModule.register();

export default class RadialGaugeNeedle extends SharedComponent {

    constructor(props: any) {
        super(props);

        this.state = { componentVisible: true }
    }

    public render() {
        return (
            <div className="sampleFlexRows">
            <IgrRadialGauge
                height="100%"
                width="100%"
                isNeedleDraggingEnabled={true}
                isNeedleDraggingConstrained={true}
                needleShape="NeedleWithBulb"
                needleBrush="DodgerBlue"
                needleOutline="DodgerBlue"
                needleEndExtent={0.475}
                needleStrokeThickness={1}

                needlePivotShape="CircleOverlay"
                needlePivotBrush="#9f9fa0"
                needlePivotOutline="#9f9fa0"
                needlePivotWidthRatio={0.2}
                needlePivotStrokeThickness={1}

                value={50}
                minimumValue={0}
                maximumValue={80}
                interval={10} />
            </div>
        );
    }
}