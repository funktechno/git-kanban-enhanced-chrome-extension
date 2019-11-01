export default `
    ul.drag-list, ul.drag-inner-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.drag-container {
    max-width: 1000px;
    margin: 20px auto;
}
.drag-list {
    display: flex;
    align-items: flex-start;
}
@media(max-width: 690px) {
    .drag-list {
        display: block;
    }
}
.drag-column {
    flex: 1;
    margin: 0 10px;
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
}
@media(max-width: 690px) {
    .drag-column {
        margin-bottom: 30px;
    }
}
.drag-column h2 {
    font-size: 0.8rem;
    margin: 0;
    text-transform: uppercase;
    font-weight: 600;
}
.drag-column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}
.drag-inner-list {
    min-height: 50px;
    color: white;
}
.drag-item {
    padding: 10px;
    margin: 10px;
    height: 100px;
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.drag-item.is-moving {
    transform: scale(1.5);
    background: rgba(0, 0, 0, 0.8);
}
.drag-header-more {
    cursor: pointer;
}
.drag-options {
    position: absolute;
    top: 44px;
    left: 0;
    width: 100 %;
    height: 100 %;
    padding: 10px;
    transform: translateX(100 %);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.drag-options.active {
    transform: translateX(0);
    opacity: 1;
}
.drag-options-label {
    display: block;
    margin: 0 0 5px 0;
}
.drag-options-label input {
    opacity: 0.6;
}
.drag-options-label span {
    display: inline-block;
    font-size: 0.9rem;
    font-weight: 400;
    margin-left: 5px;
}
/* Dragula CSS */
.gu-mirror {
    position: fixed!important;
    margin: 0!important;
    z-index: 9999!important;
    opacity: 0.8;
    list-style-type: none;
}
.gu-hide {
    display: none!important;
}
.gu-unselectable {
    -webkit-user-select: none!important;
    -moz-user-select: none!important;
    -ms-user-select: none!important;
    user-select: none!important;
}
.gu-transit {
    opacity: 0.2;
}
`;
