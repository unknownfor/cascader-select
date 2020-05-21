class TranslateTreeIntoList {
    constructor({
        data = {},
        childNameList = [],
        targetNameList = [],
        finalKey,
    }) {
        this.childNameList = childNameList;
        this.targetNameList = targetNameList;
        this.data = data;
        this.finalKey = finalKey;
        this.list = [];
        this.initData();
    }
    hasChildren(node) {
        for (let i = 0; i < this.childNameList.length; i++) {
            if (node[this.childNameList[i]]) {
                return node[this.childNameList[i]]
            }
        }
        return false;
    }

    getNodeName(node) {
        for (let i = 0; i < this.targetNameList.length; i++) {
            if (node[this.targetNameList[i]]) {
                return node[this.targetNameList[i]]
            }
        }
        return false;
    }

    initData() {
        if (!this.data || this.data == []) {
            return []
        } else if (this.data.length > 0) {
            this.data.forEach(node => {
                this.findPath({
                    node,
                    path: this.getNodeName(node),

                });
            })
        }
    }
    // 找到底部，并且记录寻径步骤
    // 当目标节点没有子节点，认为已经找到了底，仅仅返回false，但是向大类，push一个
    findPath({
        node,
        path = ''
    }) {
        if (this.hasChildren(node)) {
            this.hasChildren(node).forEach(node => {
                name = path + " > " + this.getNodeName(node);
                this.findPath({
                    node,
                    path: name
                });
            })
        } else {
            this.list.push({
                name: path,
                id: node[this.finalKey],
                description: node.description ? node.description : ''
            });
        };
    }
    // 清洗数据
    clearData(data) {
        var that = this;
        if (data.selectIndex) {
            data.selectIndex = -1;
        }
        data.forEach(function (e) {
            if (that.hasChildren(e)) {
                that.clearData(that.hasChildren(e));
            }
        })
    }
    // 基础方法，捕获节点,
    // 如果這個節點他不在 this.container 裏面， 繼續檢測也沒有意義， 直接return false
    catchDom({
        dom,
        className
    }) {
        if (!dom) return false;
        if (!this.select_3331Container.contains(dom)) return false;
        if (dom == document.body) {
            // 最多冒泡到body
            return false;
        } else if (dom.classList.contains(className)) {
            // 如果符合条件，返回这次冒泡捕获到的元素
            return dom;
        } else {
            // 尾递归其父元素
            return this.catchDom({
                dom: dom.parentElement,
                className
            });
        }
    };
    throttle(callback, ms) {
        var times;
        var last = 0;
        var outArgs = arguments
        return function () {
            var innerArgs = arguments
            var now = +new Date();
            if (now > last + ms) {
                // 超过节流时间，执行一次,并将上次执行时间戳更新。
                last = now
                callback.apply(this, [...innerArgs, ...[...outArgs].splice(2, )]);
            }
        }
    }
    getElementLeftTop(element) {
        var actualLeft = element.offsetLeft;
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return {
            left: actualLeft,
            top: actualTop
        };
    }
}














// select_3331 插件
function select_3331({
    select,
    data = [],
    childNameList = [],
    targetNameList = [],
    finalKey = 'project_id',
    level = [],
    chosedData,
}) {
    this.select_3331Container = document.createElement('div');
    this.dropContainer = document.createElement('div');
    this.input = document.createElement('input');
    this.inputContainer = document.createElement('div');
    this.select = select;
    this.width = this.select.getBoundingClientRect().width;
    //特殊处理dom 获取到0的高度
    this.width == 0 ? this.width = 650 : ''
    this.direct = document.createElement('span');
    this.descriptionElement = document.createElement('p');
    this.clearButton = document.createElement('span');
    this.hoverShowDecriptContainer = document.createElement('span');
    this.level = level;
    this.finalKey = finalKey;
    this.data = JSON.parse(JSON.stringify(data));
    this.childNameList = [...childNameList, 'child', 'children', 'projects'];
    this.targetNameList = [...targetNameList, 'name', 'project_name'];
    this.list = (new TranslateTreeIntoList({
        ...this
    })).list; // 转换后的扁平化的二级数据
    this.chosedData = chosedData;
    this.init();
}

select_3331.prototype = new TranslateTreeIntoList({
    data: {}
});

select_3331.prototype.init = function () {
    if (
        this.select.previousElementSibling &&
        this.select.previousElementSibling.className.match(/select_3331/)
    ) return false;
    this.initElement();
    this.initCss();
    this.bindEvent();
    this.chosedData ? this.bindData(this.chosedData) : ''
};
select_3331.prototype.initElement = function () {
    this.select.classList.add('hide');
    this.select_3331Container.className = 'select_3331-container';
    this.inputContainer.className = 'form-control input-container';
    this.inputContainer.appendChild(this.input);

    this.clearButton.innerHTML = "✖";
    this.clearButton.id = 'select_3331-clear';
    this.clearButton.className = 'select_3331-clear hide';
    this.inputContainer.appendChild(this.clearButton);

    this.direct.innerHTML = "▾";
    this.direct.id = 'direct';
    this.direct.className = 'direct';
    this.inputContainer.appendChild(this.direct);

    this.descriptionElement.id = 'select_3331-description';
    this.descriptionElement.className = 'select_3331-description';
    this.inputContainer.appendChild(this.descriptionElement);

    this.hoverShowDecriptContainer.className = 'hover-show-decript-container';

    this.dropContainer.className = 'drop-container';
    this.input.placeholder = '输入 事项分类/费用名称/科目名称/使用场景 搜索';
    this.select_3331Container.appendChild(this.inputContainer);
    this.select_3331Container.appendChild(this.dropContainer);
    // this.select_3331Container.appendChild(this.hoverShowDecriptContainer);
    document.body.appendChild(this.hoverShowDecriptContainer);
    this.select.parentElement.insertBefore(this.select_3331Container, this.select);
    this.select.parentElement.insertBefore(this.descriptionElement, this.select);
}
select_3331.prototype.bindEvent = function () {
    // 键入事件监听
    this.input.addEventListener('keyup', (e) => {
        if (e.target.value.length > 0) {
            this.globalMatch(e.target.value);
            this.inputContainer.querySelector('.select_3331-clear').classList.remove('hide');
        } else {
            this.selectMatch({
                currentClickLevel: -1
            });
            this.inputContainer.querySelector('.select_3331-clear').classList.add('hide');
        }
    })
    // 容器内的具体选项选择
    document.body.addEventListener('click', (e) => {
        var isDom;
        // 如果是清空按鈕
        isDom = this.catchDom({
            dom: e.target,
            className: 'select_3331-clear'
        })
        if (this.catchDom({
                dom: e.target,
                className: 'select_3331-clear'
            })) {
            this.clearData(this.data);
            this.input.click();
            this.input.value = '';
            this.descriptionElement.textContent = '';
            this.select.options[0] = new Option('', '');
            this.input.focus();
            this.inputContainer.querySelector('.select_3331-clear').classList.add('hide');
            return;
        };
        isDom = this.catchDom({
            dom: e.target,
            className: 'list'
        })
        if (isDom) {
            if (isDom.parentElement.classList.contains('global-select-container')) {
                // 全局选择
                this.dropContainer.innerHTML = '';
                this.direct.classList.remove('up');
                this.select_3331Container.classList.remove('active');
                let reg = /（.*?）/g
                this.input.value = isDom.textContent.replace(reg, '');
                this.select.options[0] = new Option(isDom.dataset.id, isDom.dataset.id);
                this.descriptionElement.textContent = isDom.dataset.description ? `使用场景：${isDom.dataset.description}` :'';
                this.hoverShowDecriptContainer.innerHTML = '';
                this.hoverShowDecriptContainer.style.opacity = 0;
            } else if (isDom.parentElement.classList.contains('body')) {
                // 分类选择
                if (isDom.parentElement.querySelector('.active')) {
                    isDom.parentElement.querySelector('.active').classList.remove('active');
                };
                isDom.classList.add('active');
                isDom.parentElement.parentElement.root.selectIndex = isDom.dataset.index;
                this.selectMatch({
                    // 当前点击的级别
                    currentClickLevel: isDom.parentElement.parentElement.dataset.level
                });
                this.input.value = this.enumerateAllList()
                this.inputContainer.querySelector('.select_3331-clear').classList.remove('hide');
                if (!this.hasChildren(isDom.parentElement.parentElement.root[isDom.dataset.index])) {
                    this.dropContainer.innerHTML = '';
                    this.direct.classList.remove('up');
                    this.select_3331Container.classList.remove('active');
                    if (isDom.dataset.id) {
                        // 如果当前 点击的三级选择框 有具体的id ，那就说明这个id就是最终选择项， 给他添加到select上面
                        this.select.options[0] = new Option(isDom.dataset.id, isDom.dataset.id);
                        this.descriptionElement.textContent = isDom.dataset.description ? `使用场景：${isDom.dataset.description}` : ''
                        this.hoverShowDecriptContainer.innerHTML = '';
                        this.hoverShowDecriptContainer.style.opacity = 0;
                    }
                }
            }
            return;
        }
        // 捕获select_3331-container节点
        isDom = this.catchDom({
            dom: e.target,
            className: 'select_3331-container'
        })
        // 如果这个时候，你选到一半，退出了，则清空选项和hover tip
        if (!this.select.value) {
            this.input.value = '';
            this.hoverShowDecriptContainer.style.opacity = '0';
        }
        if (!isDom) {
            this.dropContainer.innerHTML = '';
            this.direct.classList.remove('up');
            this.select_3331Container.classList.remove('active');
            // this.descriptionElement.textContent = '';
            return;
        };
        // 捕获 input-container 节点
        isDom = this.catchDom({
            dom: e.target,
            className: 'input-container'
        })
        if (isDom) {
            if (isDom.querySelector('input').value == '') {
                this.selectMatch({
                    currentClickLevel: -1
                });
            }
            return;
        }
    })
    // 新增移入事件
    this.select_3331Container.addEventListener(
        'mousemove',
        this.throttle((e) => {
            const el = e.target;
            if (el.dataset.description) {
                const listPos = el.getBoundingClientRect();
                const {
                    left,
                    top
                } = this.getElementLeftTop(el);
                this.hoverShowDecriptContainer.style.left = `${left + listPos.width/1.2 }px`;
                this.hoverShowDecriptContainer.style.top = `${top}px`;
                // this.hoverShowDecriptContainer.style.top = `${top + listPos.height/2}px`;
                this.hoverShowDecriptContainer.style.opacity = '1';
                this.hoverShowDecriptContainer.textContent = el.dataset.description;
            } else {
                this.hoverShowDecriptContainer.textContent = '';
                this.hoverShowDecriptContainer.style.opacity = '0';
            }
        }, 20),
    )
}

select_3331.prototype.enumerateAllList = function () {
    const listDom = this.dropContainer.querySelectorAll('.active');
    return Array.prototype.slice.call(listDom).map(e => e.innerHTML).join(' > ');
}

select_3331.prototype.initCss = function () {
    if (!document.querySelector('style.wdqwdwdwdw')) {
        const style = document.createElement('style');
        style.className = 'wdqwdwdwdw';
        style.innerHTML = `
            .select_3331-description {
                font-size: 14px;
                color: rgba(102, 102, 102, 1);
                width: ${this.width}px;
                display: inline-block;
            }

            .select_3331-container {
                position: relative;
            }
            .input-container {
                display: flex!important;
                flex-direction: row;
                align-items: center;
                margin-bottom: 10px;
                box-shadow: 0 0 0 rgba(0,0,0,0.175);
            }
            .select_3331-container.active .input-container,
            .select_3331-container.active .drop-container {
                box-shadow: 0 6px 12px rgba(0,0,0,0.175)!important;
                border-color: #93a1bb;
            }
            .input-container input {
                outline: none;
                border: none;
                margin: 0;
                flex: 1 0 auto;
                font-size: 12px;
            }
            .input-container .select_3331-clear {
                cursor: pointer;
                flex: 0 0 auto;
                user-select: none;
                font-weight: bolder;
            }
            .input-container .direct {
                flex: 0 0 auto;
                height: 7px;
                transition: 0.2s all;
                color: #999;
                user-select: none;
                font-size: 19px;
                line-height: 9px;
                transform: scaleY(0.8);
            }
            .input-container .direct.up {
                transform: rotate(180deg);
            }
            
            .input-container.active {
                box-shadow: 0 6px 12px rgba(0,0,0,0.175);
                border-color: #93a1bb;
            }

            .hover-show-decript-container {
                opacity: 0;
                position: absolute;
                z-index: 10;
                background: rgba(0,0,0,0.5);
                padding: 6px;
                border-radius: 0px 5px 5px 5px;
                color: #fff;
                font-size: 12px;
            }

            .hover-show-decript-container:after {
                content: '';
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 5px 20px 0;
                border-color: transparent rgba(0,0,0,0.5) transparent transparent;
                position: absolute;
                top: 0;
                left: -5px;
            }
            .drop-container {
                box-shadow: 0 0 0 rgba(0,0,0,0.175);
                position: absolute;
                z-index: 10;
                top: 37px;
                left: 0px;
                padding: 0;
                width: auto;
                overflow: hidden;
                background: white;
                border: 1px solid #C2CAD8FF;
                border-radius: 5px;
                display: flex;
            }
            .global-select-container {
                padding: 0;
                width: ${this.width}px;
                height: 160px;
                overflow: auto;
                background: white;
            }
            .drop-container .empty {
                height: 100%;
                width: ${this.width}px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-size: 12px;
                color: rgba(102, 102, 102, 1);
            }
            .drop-container .empty img {
                width: 120px;
                margin: 12px;
            }
            .drop-container .list {
                color: rgba(102, 102, 102, 1);
                padding: 0 13px;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                width: 100%;
                font-size: 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .drop-container .list.active {
                background: rgba(53, 152, 220, 0.2);
            }
            .drop-container .list:hover {
                background: rgba(53, 152, 220, 0.2);
            }
            .drop-container .list .match {
                color: rgba(53, 152, 220, 1);
            }
            .drop-container .level-select-container {
                width: ${this.width/3}px;
                height: 160px;
            }
            .drop-container .level-select-container + .level-select-container {
                border-left: 1px solid #C2CAD8FF;
            }
  
            .drop-container .level-select-container .head {
                font-size: 14px;
                font-weight: bold;
                padding: 0 13px;
                line-height: 30px;
                height: 30px;
            }
            .drop-container .level-select-container .body {
                height: calc(100% - 30px);
                overflow: auto;
                font-size: 12px;
            }



            
            .select_3331-scroll::-webkit-scrollbar {
                width: 6px;
                height: 0px;
            }
            .select_3331-scroll::-webkit-scrollbar:end {
                display: none;
            }
            .select_3331-scroll::-webkit-scrollbar-thumb {
                background-color: rgba(194, 202, 216, 1);
                border-radius: 4px;
            }
            .select_3331-scroll::-webkit-scrollbar-thumb:end {
                display: none;
            }
            .select_3331-scroll::-webkit-scrollbar-track {
              background-color: rgba(0, 0, 0, 0);
            }
            .select_3331-scroll::-webkit-scrollbar-thumb:window-inactive {
                background-color: rgba(194, 202, 216, 1);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 全局匹配 ，当输入文字的时候触发 
 * 只允许搜索 汉字、字母和数字
 *  */
select_3331.prototype.globalMatch = function (value) {
    let rules =  new RegExp(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/) 
    let filterList = []
    if(rules.test(value)){
       filterList = this.list.filter(e => e.name.match(value) || e.description.match(value))
       filterList.length > 5 ? filterList = filterList.slice(0,5) : ""
    }
    if (filterList.length > 0) {
        const reg = new RegExp(`(${value})`);
        this.dropContainer.innerHTML =  '<div class="select_3331-scroll global-select-container">' + 
        filterList
            .map(e => `<div class="list detail" data-id="${e.id}" data-description="${e.description}"><span class="final-name">${e.name.replace(reg,'<span class="match">$1</span>')}</span>${reg.exec(e.description) ? '（使用场景：' : ''} ${reg.exec(e.description) ? e.description.replace(reg,'<span class="match">$1</span>'): ''}${reg.exec(e.description) ? '）' : ''} </div>`)
            .join('') + '</div>';
        this.direct.classList.add('up');
        this.select_3331Container.classList.add('active');
    } else if (filterList.length == 0) {
        this.dropContainer.innerHTML = `<div class="empty">
            <img src="https://static.pipk.top/api/public/images/8731889192064048.png"/>
            <p>无结果</p>
        </div>`;
        this.direct.classList.add('up');
        this.select_3331Container.classList.add('active');
    }
}
// 3级匹配
select_3331.prototype.selectMatch = function ({
    currentClickLevel
}) {
    const generatContainer = ({
        data,
        head,
        level
    }) => {
        const container = document.createElement('div');
        container.className = 'level-select-container';
        container.root = data;
        container.dataset.level = level;
        container.dataset.level == 2 ?
            container.innerHTML = `
            <div class="head">${head}</div>
            <div class="body select_3331-scroll">
                ${data
                    .map((e,i)=>`<div ${e[this.finalKey]?`data-id="${e[this.finalKey]}"`:''} data-index="${i}" data-description="${e.description}" class="select_3331-scroll list ${data.selectIndex==i?'active':''}">${this.getNodeName(e)}</div>`)
                    .join('')}
            </div>
        ` :
            container.innerHTML = `
        <div class="head">${head}</div>
        <div class="body select_3331-scroll">
            ${data
                .map((e,i)=>`<div ${e[this.finalKey]?`data-id="${e[this.finalKey]}"`:''} data-index="${i}" class="select_3331-scroll list ${data.selectIndex==i?'active':''}">${this.getNodeName(e)}</div>`)
                .join('')}
        </div>
    `
        return container;
    };
    // 清除除了当前点击项目，之后的级别选择框
    Array.prototype.slice.call(this.dropContainer.children).forEach((e, i) => i > currentClickLevel ? e.remove() : '')
    let i = 0;
    let level = 0;
    const recursion = ({
        data
    }) => {
        if (Number(currentClickLevel) < Number(level)) {
            const appendContainer = generatContainer({
                data,
                head: this.level[i++],
                level: level++
            });
            this.dropContainer.append(appendContainer);
            this.direct.classList.add('up');
            this.select_3331Container.classList.add('active');
            // appendContainer.querySelector('.active')&&appendContainer.querySelector('.active').scrollIntoView();
        } else {
            generatContainer({
                data,
                head: this.level[i++],
                level: level++
            });
        }
        // 如果有子元素，继续递归
        if (
            data.selectIndex > -1 &&
            this.hasChildren(data[data.selectIndex])
        ) {
            recursion({
                data: this.hasChildren(data[data.selectIndex])
            });
        };
    };
    recursion({
        data: this.data
    })
}

select_3331.prototype.bindData = function (chosedData) {
    this.input.value = chosedData.name;
    this.inputContainer.querySelector('.select_3331-clear').classList.remove('hide');
    this.select.options[0] = new Option(chosedData.id, chosedData.id);
}