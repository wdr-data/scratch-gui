const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px

const motion = function (isStage, targetId) {
    return `
    <category name="Motion" colour="#4C97FF" secondaryColour="#3373CC">
        ${isStage ? `
        <label text="Stage selected: no motion blocks"></label>
        ` : `
        <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>`}
        ${categorySeparator}
    </category>
    `;
};

const looks = function (isStage, targetId) {
    return `
    <category name="Looks" colour="#9966FF" secondaryColour="#774DCB">
        ${isStage ? '' : `
        <block type="looks_sayforsecs">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">Hello!</field>
                </shadow>
            </value>
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        `}
        ${isStage ? '' : `
            <block type="looks_show"/>
            <block type="looks_hide"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sound = function () {
    return ``;
};

const events = function (isStage) {
    return `
    <category name="Events" colour="#FFD500" secondaryColour="#CC9900">
        <block type="event_whenflagclicked"/>
        ${blockSeparator}
        <block type="event_whenbroadcastreceived">
        </block>
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const control = function (isStage) {
    return `
    <category name="Control" colour="#FFAB19" secondaryColour="#CF8B17">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block id="forever" type="control_forever"/>
        ${blockSeparator}
        <block type="control_if"/>
        ${blockSeparator}
        ${isStage ? `
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
        ` : `
            <block type="control_start_as_clone"/>
            <block type="control_create_clone_of">
                <value name="CLONE_OPTION">
                    <shadow type="control_create_clone_of_menu"/>
                </value>
            </block>
            <block type="control_delete_this_clone"/>
        `}
        ${categorySeparator}
    </category>
    `;
};

const sensing = function (isStage) {
    return `
    <category name="Sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
        ${isStage ? '' : `
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
            ${blockSeparator}
        `}
        <block type="sensing_keypressed">
            <value name="KEY_OPTION">
                <shadow type="sensing_keyoptions"/>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const operators = function () {
    return `
    <category name="Operators" colour="#40BF4A" secondaryColour="#389438">
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="operator_not"/>
    `;
};

const variables = function () {
    return ``;
};

const myBlocks = function () {
    return ``;
};

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isStage - Whether the toolbox is for a stage-type target.
 * @param {?string} targetId - The current editing target
 * @param {string?} categoriesXML - null for default toolbox, or an XML string with <category> elements.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (isStage, targetId, categoriesXML) {
    const gap = [categorySeparator];

    const everything = [
        xmlOpen,
        motion(isStage, targetId), gap,
        looks(isStage, targetId), gap,
        sound(isStage, targetId), gap,
        events(isStage, targetId), gap,
        control(isStage, targetId), gap,
        sensing(isStage, targetId), gap,
        operators(isStage, targetId), gap,
        variables(isStage, targetId), gap,
        myBlocks(isStage, targetId)
    ];

    if (categoriesXML) {
        everything.push(gap, categoriesXML);
    }

    everything.push(xmlClose);
    return everything.join('\n');
};

export default makeToolboxXML;
