/**
 * @Svg组件
 * @props  color   图标颜色
 * @props  name 图标名称--文件名称
 * @props  size  图标大小
 * @props  prefix 前缀 默认icon
 * @props  iconStyle 自定义样式
 */
export default function SvgIcon({
                                    color,
                                    name,
                                    prefix = 'icon',
                                    size = 16,
                                    iconStyle,
                                }) {
    const symbolId = `#${prefix}-${name}`
    return (
        <svg aria-hidden="true" style={iconStyle}  width={size} height={size} fill={color}>
            <use href={symbolId} fill={color}/>
        </svg>
    );
}