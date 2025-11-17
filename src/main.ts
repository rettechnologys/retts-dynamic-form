import { createApp, defineAsyncComponent as dac } from 'vue'
import './style.css'
import App from './App.vue'

//#region Primevue
import PrimeVue from 'primevue/config';
import { FilterMatchMode } from 'primevue/api';
import 'primeflex/primeflex.min.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import BadgeDirective from 'primevue/badgedirective';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import { ValidatorPlugin } from 'retts-dynamic-form';
// import AutoComplete from 'primevue/autocomplete';
const AutoComplete = dac(() => import('primevue/autocomplete'));
import Accordion from 'primevue/accordion';
//const Accordion = dac(() => import('primevue/accordion'));
import AccordionTab from 'primevue/accordiontab';
//const AccordionTab = dac(() => import('primevue/accordiontab'));
// import Avatar from 'primevue/avatar';
const Avatar = dac(() => import('primevue/avatar'));
// import AvatarGroup from 'primevue/avatargroup';
const AvatarGroup = dac(() => import('primevue/avatargroup'));
// import Badge from 'primevue/badge';
const Badge = dac(() => import('primevue/badge'));
// import BlockUI from 'primevue/blockui';
const BlockUI = dac(() => import('primevue/blockui'));
// import Button from 'primevue/button';
const Button = dac(() => import('primevue/button'));
// import ButtonGroup from 'primevue/buttongroup';
const ButtonGroup = dac(() => import('primevue/buttongroup'));
// import Breadcrumb from 'primevue/breadcrumb';
const Breadcrumb = dac(() => import('primevue/breadcrumb'));
// import Calendar from 'primevue/calendar';
const Calendar = dac(() => import('primevue/calendar'));
// import Card from 'primevue/card';
const Card = dac(() => import('primevue/card'));
// import Chart from 'primevue/chart';
// import CascadeSelect from 'primevue/cascadeselect';
const CascadeSelect = dac(() => import('primevue/cascadeselect'));
// import Carousel from 'primevue/carousel';
const Carousel = dac(() => import('primevue/carousel'));
// import Checkbox from 'primevue/checkbox';
const Checkbox = dac(() => import('primevue/checkbox'));
// import Chip from 'primevue/chip';
const Chip = dac(() => import('primevue/chip'));
// import Chips from 'primevue/chips';
const Chips = dac(() => import('primevue/chips'));
// import ColorPicker from 'primevue/colorpicker';
const ColorPicker = dac(() => import('primevue/colorpicker'));
import Column from 'primevue/column';
//const Column = dac(() => import('primevue/column'));
import ColumnGroup from 'primevue/columngroup';
//const ColumnGroup = dac(() => import('primevue/columngroup'));
// import ConfirmDialog from 'primevue/confirmdialog';
const ConfirmDialog = dac(() => import('primevue/confirmdialog'));
// import ConfirmPopup from 'primevue/confirmpopup';
const ConfirmPopup = dac(() => import('primevue/confirmpopup'));
// import ContextMenu from 'primevue/contextmenu';
const ContextMenu = dac(() => import('primevue/contextmenu'));
import DataTable from 'primevue/datatable';
//const DataTable = dac(() => import('primevue/datatable'));
// import DataView from 'primevue/dataview';
const DataView = dac(() => import('primevue/dataview'));
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
//const DataViewLayoutOptions = dac(() => import('primevue/dataviewlayoutoptions'));
// import DeferredContent from 'primevue/deferredcontent';
const DeferredContent = dac(() => import('primevue/deferredcontent'));
// import Dialog from 'primevue/dialog';
const Dialog = dac(() => import('primevue/dialog'));
// import Divider from 'primevue/divider';
const Divider = dac(() => import('primevue/divider'));
// import Dock from 'primevue/dock';
const Dock = dac(() => import('primevue/dock'));
// import Dropdown from 'primevue/dropdown';
const Dropdown = dac(() => import('primevue/dropdown'));
// import DynamicDialog from 'primevue/dynamicdialog';
const DynamicDialog = dac(() => import('primevue/dynamicdialog'));
// import Editor from 'primevue/editor';
// import Fieldset from 'primevue/fieldset';
const Fieldset = dac(() => import('primevue/fieldset'));
// import FileUpload from 'primevue/fileupload';
const FileUpload = dac(() => import('primevue/fileupload'));
// import FloatLabel from 'primevue/floatlabel';
const FloatLabel = dac(() => import('primevue/floatlabel'));
// import Galleria from 'primevue/galleria';
const Galleria = dac(() => import('primevue/galleria'));
// import IconField from 'primevue/iconfield';
const IconField = dac(() => import('primevue/iconfield'));
// import Image from 'primevue/image';
const Image = dac(() => import('primevue/image'));
// import InlineMessage from 'primevue/inlinemessage';
const InlineMessage = dac(() => import('primevue/inlinemessage'));
// import Inplace from 'primevue/inplace';
const Inplace = dac(() => import('primevue/inplace'));
// import InputGroup from 'primevue/inputgroup';
const InputGroup = dac(() => import('primevue/inputgroup'));
// import InputGroupAddon from 'primevue/inputgroupaddon';
const InputGroupAddon = dac(() => import('primevue/inputgroupaddon'));
// import InputIcon from 'primevue/inputicon';
const InputIcon = dac(() => import('primevue/inputicon'));
// import InputSwitch from 'primevue/inputswitch';
const InputSwitch = dac(() => import('primevue/inputswitch'));
// import InputText from 'primevue/inputtext';
const InputText = dac(() => import('primevue/inputtext'));
// import InputMask from 'primevue/inputmask';
const InputMask = dac(() => import('primevue/inputmask'));
// import InputNumber from 'primevue/inputnumber';
const InputNumber = dac(() => import('primevue/inputnumber'));
// import Knob from 'primevue/knob';
const Knob = dac(() => import('primevue/knob'));
// import Listbox from 'primevue/listbox';
const Listbox = dac(() => import('primevue/listbox'));
// import MegaMenu from 'primevue/megamenu';
const MegaMenu = dac(() => import('primevue/megamenu'));
// import Menu from 'primevue/menu';
const Menu = dac(() => import('primevue/menu'));
// import Menubar from 'primevue/menubar';
const Menubar = dac(() => import('primevue/menubar'));
// import Message from 'primevue/message';
const Message = dac(() => import('primevue/message'));
// import MultiSelect from 'primevue/multiselect';
const MultiSelect = dac(() => import('primevue/multiselect'));
// import OrderList from 'primevue/orderlist';
const OrderList = dac(() => import('primevue/orderlist'));
// import OrganizationChart from 'primevue/organizationchart';
const OrganizationChart = dac(() => import('primevue/organizationchart'));
import OverlayPanel from 'primevue/overlaypanel';
// const OverlayPanel = dac(() => import('primevue/overlaypanel'));
// import Paginator from 'primevue/paginator';
const Paginator = dac(() => import('primevue/paginator'));
import Panel from 'primevue/panel';
//const Panel = dac(() => import('primevue/panel'));
import PanelMenu from 'primevue/panelmenu';
//const PanelMenu = dac(() => import('primevue/panelmenu'));
// import Password from 'primevue/password';
const Password = dac(() => import('primevue/password'));
// import PickList from 'primevue/picklist';
const PickList = dac(() => import('primevue/picklist'));
// import ProgressBar from 'primevue/progressbar';
const ProgressBar = dac(() => import('primevue/progressbar'));
// import ProgressSpinner from 'primevue/progressspinner';
const ProgressSpinner = dac(() => import('primevue/progressspinner'));
// import Rating from 'primevue/rating';
const Rating = dac(() => import('primevue/rating'));
// import RadioButton from 'primevue/radiobutton';
const RadioButton = dac(() => import('primevue/radiobutton'));
//import Row from 'primevue/row';
const Row = dac(() => import('primevue/row'));
// import SelectButton from 'primevue/selectbutton';
const SelectButton = dac(() => import('primevue/selectbutton'));
// import ScrollPanel from 'primevue/scrollpanel';
const ScrollPanel = dac(() => import('primevue/scrollpanel'));
// import ScrollTop from 'primevue/scrolltop';
const ScrollTop = dac(() => import('primevue/scrolltop'));
// import Skeleton from 'primevue/skeleton';
const Skeleton = dac(() => import('primevue/skeleton'));
// import Slider from 'primevue/slider';
const Slider = dac(() => import('primevue/slider'));
// import Sidebar from 'primevue/sidebar';
const Sidebar = dac(() => import('primevue/sidebar'));
// import SpeedDial from 'primevue/speeddial';
const SpeedDial = dac(() => import('primevue/speeddial'));
// import SplitButton from 'primevue/splitbutton';
const SplitButton = dac(() => import('primevue/splitbutton'));
import Splitter from 'primevue/splitter';
//const Splitter = dac(() => import('primevue/splitter'));
import SplitterPanel from 'primevue/splitterpanel';
//const SplitterPanel = dac(() => import('primevue/splitterpanel'));
// import Steps from 'primevue/steps';
const Steps = dac(() => import('primevue/steps'));
// import TabMenu from 'primevue/tabmenu';
const TabMenu = dac(() => import('primevue/tabmenu'));
// import TieredMenu from 'primevue/tieredmenu';
const TieredMenu = dac(() => import('primevue/tieredmenu'));
// import Textarea from 'primevue/textarea';
const Textarea = dac(() => import('primevue/textarea'));
// import Toast from 'primevue/toast';
const Toast = dac(() => import('primevue/toast'));
// import Toolbar from 'primevue/toolbar';
const Toolbar = dac(() => import('primevue/toolbar'));
import TabView from 'primevue/tabview';
//const TabView = dac(() => import('primevue/tabview'));
import TabPanel from 'primevue/tabpanel';
//const TabPanel = dac(() => import('primevue/tabpanel'));
// import Tag from 'primevue/tag';
const Tag = dac(() => import('primevue/tag'));
// import Terminal from 'primevue/terminal';
const Terminal = dac(() => import('primevue/terminal'));
// import Timeline from 'primevue/timeline';
const Timeline = dac(() => import('primevue/timeline'));
// import ToggleButton from 'primevue/togglebutton';
const ToggleButton = dac(() => import('primevue/togglebutton'));
//const Tooltip = dac(() => import('primevue/tooltip'));
// import Tree from 'primevue/tree';
const Tree = dac(() => import('primevue/tree'));
// import TreeSelect from 'primevue/treeselect';
const TreeSelect = dac(() => import('primevue/treeselect'));
// import TreeTable from 'primevue/treetable';
const TreeTable = dac(() => import('primevue/treetable'));
// import TriStateCheckbox from 'primevue/tristatecheckbox';
const TriStateCheckbox = dac(() => import('primevue/tristatecheckbox'));
// import VirtualScroller from 'primevue/virtualscroller';
const VirtualScroller = dac(() => import('primevue/virtualscroller'));
//#endregion Primevue

const app = createApp(App);

//#region PrimeVue
app.use(PrimeVue, {
  ripple: true,
  filterMatchModeOptions: {
    text: [
      FilterMatchMode.STARTS_WITH,
      FilterMatchMode.CONTAINS,
      FilterMatchMode.NOT_CONTAINS,
      FilterMatchMode.ENDS_WITH,
      FilterMatchMode.EQUALS,
      FilterMatchMode.NOT_EQUALS,
    ],
    numeric: [
      FilterMatchMode.EQUALS,
      FilterMatchMode.NOT_EQUALS,
      FilterMatchMode.LESS_THAN,
      FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
      FilterMatchMode.GREATER_THAN,
      FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    ],
    date: [
      FilterMatchMode.DATE_IS,
      FilterMatchMode.DATE_IS_NOT,
      FilterMatchMode.DATE_BEFORE,
      FilterMatchMode.DATE_AFTER,
      FilterMatchMode.LESS_THAN,
      FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
      FilterMatchMode.GREATER_THAN,
      FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    ],
  },
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.use(ValidatorPlugin);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Badge', Badge);
app.component('BlockUI', BlockUI);
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('ButtonGroup', ButtonGroup);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Carousel', Carousel);
app.component('CascadeSelect', CascadeSelect);
app.component('Checkbox', Checkbox);
app.component('Chip', Chip);
app.component('Chips', Chips);
app.component('ColorPicker', ColorPicker);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ContextMenu', ContextMenu);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('DeferredContent', DeferredContent);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dock', Dock);
app.component('Dropdown', Dropdown);
app.component('DynamicDialog', DynamicDialog);
app.component('Fieldset', Fieldset);
app.component('FileUpload', FileUpload);
app.component('FloatLabel', FloatLabel);
app.component('Galleria', Galleria);
app.component('IconField', IconField);
app.component('Image', Image);
app.component('InlineMessage', InlineMessage);
app.component('Inplace', Inplace);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('InputIcon', InputIcon);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Knob', Knob);
app.component('Listbox', Listbox);
app.component('MegaMenu', MegaMenu);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('MultiSelect', MultiSelect);
app.component('OrderList', OrderList);
app.component('OrganizationChart', OrganizationChart);
app.component('OverlayPanel', OverlayPanel);
app.component('Paginator', Paginator);
app.component('Panel', Panel);
app.component('PanelMenu', PanelMenu);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('SelectButton', SelectButton);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Slider', Slider);
app.component('Sidebar', Sidebar);
app.component('Skeleton', Skeleton);
app.component('SpeedDial', SpeedDial);
app.component('SplitButton', SplitButton);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Steps', Steps);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('Textarea', Textarea);
app.component('Terminal', Terminal);
app.component('TieredMenu', TieredMenu);
app.component('Timeline', Timeline);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('ToggleButton', ToggleButton);
app.component('Tree', Tree);
app.component('TreeSelect', TreeSelect);
app.component('TreeTable', TreeTable);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('VirtualScroller', VirtualScroller);
//#endregion PrimeVue


app.mount('#app')
