var React = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    PropTypes,
} = React;

var screen = require('Dimensions').get('window');
var tweenState = require('react-tween-state');

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        //flex: 0,
        //backgroundColor: '#f3f3f3',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 10,
    },
    spacer: {
        flex: 1,
    },
    barContainer: {
        height: 4,
        position: 'relative',
    },
    bar: {
        backgroundColor: '#26E8A7',
        width: 50,
        marginTop: -3,
        marginLeft: 18,
        height: 0.5,
    }
});


var SegmentedView = React.createClass({

    mixins: [tweenState.Mixin],

    propTypes: {
        duration: PropTypes.number,
        onTransitionStart: PropTypes.func,
        onTransitionEnd: PropTypes.func,
        onPress: PropTypes.func,
        renderTitle: PropTypes.func,
        titles: PropTypes.array,
        index: PropTypes.number,
        barColor: PropTypes.string,
        underlayColor: PropTypes.string,
        stretch: PropTypes.bool,
        selectedTitleStyle: PropTypes.object,
        titleStyle: PropTypes.object,

    },

    getDefaultProps() {
        return {
            duration: 200,
            onTransitionStart: ()=>{},
            onTransitionEnd: ()=>{},
            onPress: ()=>{},
            renderTitle: null,
            index: 0,
            barColor: '#44B7E1',
            underlayColor: '#CCCCCC',
            stretch: false,
            selectedTextStyle: null,
            textStyle: null,
        };
    },

    getInitialState() {
        return {
            barLeft: 0,
            barRight: screen.width,
        };
    },

    componentDidMount() {
        setTimeout(() => this.moveTo(this.props.index), 0);
    },

    componentWillReceiveProps(nextProps) {
        this.moveTo(nextProps.index);
    },

    measureHandler(ox, oy, width) {

        this.tweenState('barLeft', {
            easing: tweenState.easingTypes.easeInOutQuad,
            duration: 200,
            endValue: ox
        });

        this.tweenState('barRight', {
            easing: tweenState.easingTypes.easeInOutQuad,
            duration: 200,
            endValue: screen.width - ox - width,
            onEnd: this.props.onTransitionEnd
        });

        setTimeout(this.props.onTransitionStart, 0);
    },

    moveTo(index) {
        this.refs[index].measure(this.measureHandler);
    },

    _renderTitle(title, i) {
        return (
            <View style={styles.title}>
                <Text style={[this.props.titleStyle, i === this.props.index && this.props.selectedTitleStyle]}>{title}</Text>
            </View>
        );
    },

    renderTitle(title, i) {
        return (
            <View key={i} ref={i} style={{ flex: this.props.stretch ? 1 : 0 }}>
                <TouchableHighlight underlayColor={this.props.underlayColor} onPress={() => this.props.onPress(i)}>
                    {this.props.renderTitle ? this.props.renderTitle(title, i) : this._renderTitle(title, i)}
                </TouchableHighlight>
            </View>
        );
    },

    render() {
        var items = [];
        var titles = this.props.titles;

        if (!this.props.stretch) {
            items.push(<View key={`s`} style={styles.spacer} />);
        }

        for (var i = 0; i < titles.length; i++) {
            items.push(this.renderTitle(titles[i], i));
            if (!this.props.stretch) {
                items.push(<View key={`s${i}`} style={styles.spacer} />);
            }
        }

        return (
            <View {...this.props} style={[styles.container, this.props.style]}>
                <View style={styles.titleContainer}>
                    {items}
                </View>
                <View style={styles.barContainer}>
                    <View ref="bar" style={[styles.bar, {
                        left: this.getTweeningValue('barLeft'),
                        right: this.getTweeningValue('barRight'),
                        backgroundColor: this.props.barColor
                    }]} />
                </View>
            </View>
        );
    }
});

module.exports = SegmentedView;
