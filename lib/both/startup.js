var adminCreateRouteEdit, adminCreateRouteEditOptions, adminCreateRouteNew, adminCreateRouteNewOptions, adminCreateRouteView, adminCreateRouteViewOptions, adminCreateRoutes, adminCreateTables, adminDelButton, adminEditButton, adminEditDelButtons, adminPublishTables, adminTablePubName, adminTablesDom, defaultColumns;

this.AdminTables = {};

adminTablesDom = '<"box"<"box-header"<"box-toolbar"<"pull-left"<lf>><"pull-right"p>>><"box-body"t>><r>';

adminEditButton = {
  data: '_id',
  title: 'Edit',
  createdCell: function(node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminEditBtn, {
      _id: cellData
    }));
  },
  width: '40px',
  orderable: false
};

adminDelButton = {
  data: '_id',
  title: 'Delete',
  createdCell: function(node, cellData, rowData) {
    return $(node).html(Blaze.toHTMLWithData(Template.adminDeleteBtn, {
      _id: cellData
    }));
  },
  width: '40px',
  orderable: false
};

adminEditDelButtons = [adminEditButton, adminDelButton];

defaultColumns = function() {
  return [
    {
      data: '_id',
      title: 'ID'
    }
  ];
};

adminTablePubName = function(collection) {
  return "admin_tabular_" + collection;
};

adminCreateTables = function(collections) {
  return _.each(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0, function(collection, name) {
    var columns;
    _.defaults(collection, {
      showEditColumn: true,
      showDelColumn: true,
      showInSideBar: true
    });
    columns = _.map(collection.tableColumns, function(column) {
      var createdCell;
      if (column.template) {
        createdCell = function(node, cellData, rowData) {
          $(node).html('');
          return Blaze.renderWithData(Template[column.template], {
            value: cellData,
            doc: rowData
          }, node);
        };
      }
      return {
        data: column.name,
        title: column.label,
        createdCell: createdCell
      };
    });
    if (columns.length === 0) {
      columns = defaultColumns();
    }
    if (collection.showEditColumn) {
      columns.push(adminEditButton);
    }
    if (collection.showDelColumn) {
      columns.push(adminDelButton);
    }
    return AdminTables[name] = new Tabular.Table({
      name: name,
      collection: adminCollectionObject(name),
      pub: collection.children && adminTablePubName(name),
      sub: collection.sub,
      columns: columns,
      extraFields: collection.extraFields,
      dom: adminTablesDom
    });
  });
};

adminCreateRoutes = function(collections) {
  _.each(collections, adminCreateRouteView);
  _.each(collections, adminCreateRouteNew);
  return _.each(collections, adminCreateRouteEdit);
};

adminCreateRouteView = function(collection, collectionName) {
  return Router.route("adminDashboard" + collectionName + "View", adminCreateRouteViewOptions(collection, collectionName));
};

adminCreateRouteViewOptions = function(collection, collectionName) {
  var options, ref;
  options = {
    path: "/admin/" + collectionName,
    template: "AdminDashboardViewWrapper",
    controller: "AdminController",
    data: function() {
      return {
        admin_table: AdminTables[collectionName]
      };
    },
    action: function() {
      return this.render();
    },
    onAfterAction: function() {
      var ref, ref1;
      Session.set('admin_title', collectionName);
      Session.set('admin_subtitle', 'View');
      Session.set('admin_collection_name', collectionName);
      return (ref = collection.routes) != null ? (ref1 = ref.view) != null ? ref1.onAfterAction : void 0 : void 0;
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref.view : void 0);
};

adminCreateRouteNew = function(collection, collectionName) {
  return Router.route("adminDashboard" + collectionName + "New", adminCreateRouteNewOptions(collection, collectionName));
};

adminCreateRouteNewOptions = function(collection, collectionName) {
  var options, ref;
  options = {
    path: "/admin/" + collectionName + "/new",
    template: "AdminDashboardNew",
    controller: "AdminController",
    action: function() {
      return this.render();
    },
    onAfterAction: function() {
      var ref, ref1;
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Create new');
      Session.set('admin_collection_page', 'new');
      Session.set('admin_collection_name', collectionName);
      return (ref = collection.routes) != null ? (ref1 = ref["new"]) != null ? ref1.onAfterAction : void 0 : void 0;
    },
    data: function() {
      return {
        admin_collection: adminCollectionObject(collectionName)
      };
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref["new"] : void 0);
};

adminCreateRouteEdit = function(collection, collectionName) {
  return Router.route("adminDashboard" + collectionName + "Edit", adminCreateRouteEditOptions(collection, collectionName));
};

adminCreateRouteEditOptions = function(collection, collectionName) {
  var options, ref;
  options = {
    path: "/admin/" + collectionName + "/:_id/edit",
    template: "AdminDashboardEdit",
    controller: "AdminController",
    waitOn: function() {
      var ref, ref1;
      Meteor.subscribe('adminCollectionDoc', collectionName, parseID(this.params._id));
      return (ref = collection.routes) != null ? (ref1 = ref.edit) != null ? ref1.waitOn : void 0 : void 0;
    },
    action: function() {
      return this.render();
    },
    onAfterAction: function() {
      var ref, ref1;
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Edit ' + this.params._id);
      Session.set('admin_collection_page', 'edit');
      Session.set('admin_collection_name', collectionName);
      Session.set('admin_id', parseID(this.params._id));
      Session.set('admin_doc', adminCollectionObject(collectionName).findOne({
        _id: parseID(this.params._id)
      }));
      return (ref = collection.routes) != null ? (ref1 = ref.edit) != null ? ref1.onAfterAction : void 0 : void 0;
    },
    data: function() {
      return {
        admin_collection: adminCollectionObject(collectionName)
      };
    }
  };
  return _.defaults(options, (ref = collection.routes) != null ? ref.edit : void 0);
};

adminPublishTables = function(collections) {
  return _.each(collections, function(collection, name) {
    if (!collection.children) {
      return void 0;
    }
    return Meteor.publishComposite(adminTablePubName(name), function(tableName, ids, fields) {
      var extraFields;
      check(tableName, String);
      check(ids, Array);
      check(fields, Match.Optional(Object));
      extraFields = _.reduce(collection.extraFields, function(fields, name) {
        fields[name] = 1;
        return fields;
      }, {});
      _.extend(fields, extraFields);
      this.unblock();
      return {
        find: function() {
          this.unblock();
          return adminCollectionObject(name).find({
            _id: {
              $in: ids
            }
          }, {
            fields: fields
          });
        },
        children: collection.children
      };
    });
  });
};

Meteor.startup(function() {
  adminCreateTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  adminCreateRoutes(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  if (Meteor.isServer) {
    adminPublishTables(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0);
  }
  console.log((typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.userSchema : void 0) && (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.userSchema : void 0) === true);
  if ((typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.userSchema : void 0) && (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.userSchema : void 0) === true) {
    if (AdminTables.Users) {
      return void 0;
    }
    return AdminTables.Users = new Tabular.Table({
      changeSelector: function(selector, userId) {
        var $or;
        $or = selector['$or'];
        $or && (selector['$or'] = _.map($or, function(exp) {
          var ref;
          if (((ref = exp.emails) != null ? ref['$regex'] : void 0) != null) {
            return {
              emails: {
                $elemMatch: {
                  address: exp.emails
                }
              }
            };
          } else {
            return exp;
          }
        }));
        return selector;
      },
      name: 'Users',
      collection: Meteor.users,
      columns: _.union([
        {
          data: '_id',
          title: 'Admin',
          createdCell: function(node, cellData, rowData) {
            return $(node).html(Blaze.toHTMLWithData(Template.adminUsersIsAdmin, {
              _id: cellData
            }));
          },
          width: '40px'
        }, {
          data: 'emails',
          title: 'Email',
          render: function(value) {
            return value[0].address;
          },
          searchable: true
        }, {
          data: 'emails',
          title: 'Mail',
          createdCell: function(node, cellData, rowData) {
            return $(node).html(Blaze.toHTMLWithData(Template.adminUsersMailBtn, {
              emails: cellData
            }));
          },
          width: '40px'
        }, {
          data: 'createdAt',
          title: 'Joined'
        }
      ], adminEditDelButtons),
      dom: adminTablesDom
    });
  }
});
