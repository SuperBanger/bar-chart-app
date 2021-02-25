const boundRoundCoef = 10;

function drawLine(ctx, color, lineWidth, from, to) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawRect(ctx, color, borderColor, from, dimensions) {
    ctx.fillStyle = color;
    ctx.strokeStyle = borderColor;

    ctx.beginPath();
    ctx.rect(from.x, from.y, dimensions.width, dimensions.height);
    ctx.stroke();
    ctx.fill();
}

function getRandomInt(min, max) {
    const minR = Math.ceil(min);
    const maxR = Math.floor(max);
    return Math.floor(Math.random() * (maxR - minR)) + minR;
}

function getRandomColor() {
    const r = getRandomInt(0, 257);
    const g = getRandomInt(0, 257);
    const b = getRandomInt(0, 257);
    return `rgb(${r}, ${g}, ${b})`;
}

class Chart {
    constructor(config) {
        this._createCanvas(config.containerId, config.canvasWidth, config.canvasHeight);
        this._configureAxises(config.axisColor, config.axisWidth);
        this._configureFont(config.fontColor, config.fontStyle, config.fontWeight, config.fontFamily);
        this._parseData(config.data);
        this._calculateDimensions();
        this._configureBars(config.barColor, config.barBorderColor);
        
        this.useGuidelines = config.useGuidelines;
        if (config.useGuidelines) {
            this._configureGuidelines(config.guidelineColor, config.guidelineWidth);
        }
    }

    drawBarChart() {
        this._drawAxises();
        this._loopThrougData();
    }

    _createCanvas(id, width, height) {
        const canvas = document.createElement('canvas');
        const container = document.getElementById(id);

        if (!container) {
            throw new Error('Invalid id provided or container does not exist.');
        }
        if (!width || !height) {
            throw new Error('Chart width or height was not provided');
        }

        canvas.setAttribute('id', `${id}-${Math.random()}`);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        container.innerHTML = '';
        container.appendChild(canvas);

        this.context = canvas.getContext('2d');
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    _configureAxises(axisColor, axisWidth) {
        this.axisRatio = 10; // percentage

        this.verticalMargin = (this.canvasHeight / 100) * this.axisRatio;
        this.horizontalMargin = (this.canvasWidth / 100) * this.axisRatio;

        this.verticalAxisWidth = this.canvasHeight - 2 * this.verticalMargin;
        this.horizontalAxisWidth = this.canvasWidth - 2 * this.horizontalMargin;

        this.axisColor = axisColor || getRandomColor();
        this.axisWidth = axisWidth || 0.75;
    }

    _configureFont(fontColor, fontStyle, fontWeight, fontFamily) {
        this.fontRatio = 3;

        const verticalFontSize = (this.canvasHeight / 100) * this.fontRatio;
        const horizontalFontSize = (this.canvasWidth / 100) * this.fontRatio;
        
        this.fontVertical = `${fontStyle || 'normal'} ${fontWeight || '300'} ${verticalFontSize}px ${fontFamily || 'times'}`;
        this.fontHorizontal = `${fontStyle || 'normal'} ${fontWeight || '300'} ${horizontalFontSize}px ${fontFamily || 'times'}`;       
        this.fontColor = fontColor || getRandomColor();  
    }

    _configureGuidelines(guidelineColor, guidelineWidth) {
        this.guidelineColor = guidelineColor || getRandomColor();
        this.guidelineWidth = guidelineWidth || 0.5;
    }

    _parseData(data) {
        if (!data) {
            throw new Error('No data provided.');
        }

        const values = [];
        const labels = [];

        let max = 0;
        let min = 0;

        for (let i = 0; i < data.length; i++) {
            const value = data[i].value;

            values.push(value);
            labels.push(data[i].label);

            if (value > max) {
                max = value;
            }
            if (value < min) {
                min = value;
            }
        }

        this.max = max;
        this.labels = labels;
        this.values = values;
        this.itemsNum = data.length;
        this.verticalUpperBound = Math.ceil(max / boundRoundCoef) * boundRoundCoef;

        this.verticalLabelFreequency = this.verticalUpperBound / this.itemsNum;
        this.horisontalLabelFreequency = this.horizontalAxisWidth / this.itemsNum;
        this.verticalFreequencyScaled = (this.verticalAxisWidth / this.verticalUpperBound) * this.verticalLabelFreequency;
    }

    _calculateDimensions() {
        this.topY = this.canvasHeight - this.verticalMargin;
        this.rightX = this.canvasWidth - this.horizontalMargin;
    }

    _configureBars(barColor, barBorderColor) {
        this.barColor = barColor || getRandomColor();
        this.barBorderColor = barBorderColor || getRandomColor();
    }

    _drawAxises() {
        // draw vertical line
        drawLine(
            this.context,
            this.axisColor,
            this.axisWidth,
            {
                x: this.horizontalMargin,
                y: this.verticalMargin
            },
            {
                x: this.horizontalMargin,
                y: this.topY
            }
        );
        // draw horizontal line
        drawLine(
            this.context,
            this.axisColor,
            this.axisWidth,
            {
                x: this.horizontalMargin,
                y: this.topY
            },
            {
                x: this.rightX,
                y: this.topY
            }
        );
    }

    _loopThrougData() {
        for (let i = 0; i <= this.itemsNum; i++) {
            this.useGuidelines && this._drawGuidelines(i);
        }
        for (let i = 0; i <= this.itemsNum; i++) {
            this._drawLabel(i);
            this._drawBar(i);
        }
    }

    _drawLabel(index) {
        // vertical label
        this.context.font = this.fontVertical;
        this.context.textAlign = 'right';
        this.context.fillStyle = this.fontColor;

        const verticalLabelText = this.verticalUpperBound - index * this.verticalLabelFreequency;
        const verticalLabelX = this.horizontalMargin - this.horizontalMargin / this.axisRatio;
        const verticalLabelY = this.verticalMargin + index * this.verticalFreequencyScaled;

        this.context.fillText(verticalLabelText, verticalLabelX, verticalLabelY);

        // horizontal label
        const horizontalLabelText = this.labels[index];
        if (horizontalLabelText) {
            this.context.font = this.fontHorizontal;
            this.context.textAlign = 'center';
            this.context.textBaseline = 'top';

            const horizontalLabelX = this.horizontalMargin + index * this.horisontalLabelFreequency + this.horisontalLabelFreequency / 2;
            const horizontalLabelY = this.topY + this.verticalMargin / this.axisRatio;

            this.context.fillText(horizontalLabelText, horizontalLabelX, horizontalLabelY);
        }
    }

    _drawBar(index) {
        const x = this.horizontalMargin + 
            index * this.horisontalLabelFreequency + 
            this.horisontalLabelFreequency / this.axisRatio;
        const y = this.topY;

        const barWidth = this.horisontalLabelFreequency - 2 * (this.horisontalLabelFreequency / this.axisRatio);
        const barHeight = -1 * this.verticalAxisWidth * this.values[index] / this.max;

        drawRect(
            this.context,
            this.barColor,
            this.barBorderColor,
            {
                x,
                y
            },
            {
                width: barWidth,
                height: barHeight
            }
        );
    }

    _drawGuidelines(index) {
        // vertical guideline
        const verticalGuidelineStartX = this.horizontalMargin + index * this.horisontalLabelFreequency;
        const verticalGuidelineStartY = this.topY;
        const verticalGuidelineEndX = this.horizontalMargin + index * this.horisontalLabelFreequency;
        const verticalGuidelineEndY = this.verticalMargin;

        drawLine(
            this.context,
            this.guidelineColor,
            this.guidelineWidth,
            {
                x: verticalGuidelineStartX,
                y: verticalGuidelineStartY
            },
            {
                x: verticalGuidelineEndX,
                y: verticalGuidelineEndY
            }
        );

        // horizontal guideline
        const horizontalGuidelineStartX = this.horizontalMargin;
        const horizontalGuidelineStartY = this.verticalMargin + index * this.verticalFreequencyScaled;
        const horizontalGuidelineEndX = this.horizontalMargin + this.horizontalAxisWidth;
        const horizontalGuidelineEndY = this.verticalMargin + index * this.verticalFreequencyScaled;

        drawLine(
            this.context,
            this.guidelineColor,
            this.guidelineWidth,
            {
                x: horizontalGuidelineStartX,
                y: horizontalGuidelineStartY
            },
            {
                x: horizontalGuidelineEndX,
                y: horizontalGuidelineEndY
            }
        );
    }
}
