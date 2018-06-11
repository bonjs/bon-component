
define(['ComboBox', 'extend'], function(ComboBox, extend) {

	var CustomEventComboBox = extend(ComboBox, {
		template: `
			
			<div class="component-combobox component-CustomEventComboBox">
				<input class="combobox-textfield" readonly ng-model="currentItem.text" ng-click="expandOrCollapse($event)" />
				<span class="combobox-drop-icon" ng-click="expandOrCollapse($event)"></span>
				<span class="combobox-textfield-icon" ng-click="clear($event)"></span>
				
				<div class="combobox-expand" ng-show="isExpand">
				
					<div class="combobox-expand-head" ng-show="isShowSearch">
						<input class="combobox-expand-search" ng-model="searchField" />
						<span class="combobox-expand-search-icon"></span>
					</div>
					<div class="combobox-expand-body">
						
						<div class="property-group">
							<font style="color:#AAC60B">访问级属性</font>
							<input id=visit type="checkbox" checked />
							<label for=visit class="property-arrow"></label>
							<ul>
								<li ng-repeat="item in listVisit" 
									ng-click="clickItem($event, item)" 
									class="{{item.value == currentItem.value ? 'active' : ''}} {{item.unavailable == true ? 'unavailable' : ''}}" >{{item.text}}</li>
							</ul>
						</div>
						
						<div class="property-group">
							<font style="color:#6BB47A">行为级属性</font>
							<input id=action type="checkbox" checked />
							<label for=action class="property-arrow"></label>
							<ul>
								<li ng-repeat="item in listAction" 
									ng-click="clickItem($event, item)" 
									class="{{item.value == currentItem.value ? 'active' : ''}} {{item.unavailable == true ? 'unavailable' : ''}}" >{{item.text}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		`,
		initEvent: function() {
			
			this.super(arguments);	// 调用父类方法
			
			// 访问级属性
			this.scope.listVisit = [
				{
					text: '访问1',
					value: '访问1',
					unavailable: true
				}, {
					text: '访问2',
					value: '访问2',
				}, {
					text: '访问3',
					value: '访问3'
				}
			];
			
			// 行为级属性
			this.scope.listAction = [
				{
					text: '行为1',
					value: '行为1'
				}, {
					text: '行为2',
					value: '行为2'
				}, {
					text: '行为3',
					value: '行为3'
				}
			];
			
			
			// 临时调试
			this.scope.isExpand = true;
			
		},
		clickItem: function(e, item) {
			var dom = e.target || e.srcElement;
			
			if(!$(dom).hasClass('unavailable')) {
				this.super(arguments);
			}
		}
	});

	return CustomEventComboBox;

});