/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import * as React from 'react'
import {
    Dimensions,
    Box,
    Theme,
    MotionProps,
    CartesianMarkerProps,
    CssMixBlendMode,
    PropertyAccessor,
} from '@nivo/core'
import { OrdinalColorScaleConfig } from '@nivo/colors'
import { LegendProps } from '@nivo/legends'
import { AxisProps, GridValues } from '@nivo/axes'
import { ScaleSpec } from '@nivo/scales'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

declare module '@nivo/scatterplot' {
    export type Value = number | string | Date
    export type ValueFormatter = (value: Value) => string | number

    export interface Datum {
        x: Value
        y: Value
    }

    export interface NodeIdDatum extends Record<string, string | number> {
        serieId: Serie['id']
        index: number
    }

    export type DerivedDatumProp<T> = (node: Datum) => T

    export interface Serie {
        id: string | number
        data: Datum[]
    }

    export interface Node {
        index: number
        id: string
        x: number
        y: number
        size: number
        style: {
            color: string
        }
        data: {
            id: string | number
            serieId: string
            x: Value
            formattedX: string | number
            y: Value
            formattedY: string | number
        }
    }

    export type DerivedNodeProp<T> = (node: Node) => T

    export interface NodeProps {
        node: Node

        x: number
        y: number
        size: number
        color: string
        blendMode: CssMixBlendMode

        onMouseEnter?: VoidFunction
        onMouseMove?: VoidFunction
        onMouseLeave?: VoidFunction
        onClick?: VoidFunction
    }

    export type NodeComponent = (props: NodeProps) => React.ReactNode
    export type NodeCanvasComponent = (ctx: CanvasRenderingContext2D, props: NodeProps) => void

    export type MouseHandler = (node: Node, event: React.MouseEvent<any>) => void

    export interface DynamicSizeSpec {
        key: string
        values: [number, number]
        sizes: [number, number]
    }

    export interface TooltipProps {
        node: Node
    }
    export type CustomTooltip = (props: TooltipProps) => React.ReactNode

    export interface ScatterPlotComputedProps {
        xScale: ScaleSpec
        yScale: ScaleSpec
        nodes: Node[]
        innerWidth: number
        innerHeight: number
        outerWidth: number
        outerHeight: number
    }

    export interface CustomSvgLayerProps
        extends Omit<ScatterPlotSvgProps, 'xScale' | 'yScale'>,
            ScatterPlotComputedProps {}
    export interface CustomCanvasLayerProps
        extends Omit<ScatterPlotCanvasProps, 'xScale' | 'yScale'>,
            ScatterPlotComputedProps {}

    export type CustomSvgLayer = (props: CustomSvgLayerProps) => React.ReactNode
    export type CustomCanvasLayer = (
        ctx: CanvasRenderingContext2D,
        props: CustomCanvasLayerProps
    ) => void

    export type CustomLayerId = 'grid' | 'axes' | 'nodes' | 'markers' | 'mesh' | 'legends'

    export interface ScatterPlotProps {
        data: Serie[]

        xScale?: ScaleSpec
        xFormat?: string | ValueFormatter
        yScale?: ScaleSpec
        yFormat?: string | ValueFormatter

        margin?: Box

        theme?: Theme
        colors?: OrdinalColorScaleConfig
        blendMode?: CssMixBlendMode

        enableGridX?: boolean
        gridXValues?: GridValues<Value>
        enableGridY?: boolean
        gridYValues?: GridValues<Value>
        axisTop?: AxisProps | null
        axisRight?: AxisProps | null
        axisBottom?: AxisProps | null
        axisLeft?: AxisProps | null

        nodeId?: PropertyAccessor<NodeIdDatum, string>
        nodeSize?: number | DerivedDatumProp<number> | DynamicSizeSpec | DerivedNodeProp<number>

        isInteractive?: boolean
        useMesh?: boolean
        debugMesh?: boolean
        onMouseEnter?: MouseHandler
        onMouseMove?: MouseHandler
        onMouseLeave?: MouseHandler
        onClick?: MouseHandler
        tooltip?: CustomTooltip

        legends?: LegendProps[]
    }

    export interface ScatterPlotSvgProps extends ScatterPlotProps, MotionProps {
        layers?: (CustomLayerId | CustomSvgLayer)[]
        renderNode?: NodeComponent
        markers?: CartesianMarkerProps[]
        role?: string
    }

    export class ScatterPlot extends React.Component<ScatterPlotSvgProps & Dimensions> {}
    export class ResponsiveScatterPlot extends React.Component<ScatterPlotSvgProps> {}

    export interface ScatterPlotCanvasProps extends ScatterPlotProps {
        pixelRatio?: number
        layers?: (CustomLayerId | CustomCanvasLayer)[]
        renderNode?: NodeCanvasComponent
    }

    export class ScatterPlotCanvas extends React.Component<ScatterPlotCanvasProps & Dimensions> {}
    export class ResponsiveScatterPlotCanvas extends React.Component<ScatterPlotCanvasProps> {}
}
