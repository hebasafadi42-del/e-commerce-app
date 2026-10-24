import React from "react";
import { Tab, Tabs, Table } from "react-bootstrap";
import { FaCheck } from "react-icons/fa6";

const ProductTabs = () => {
  const specs = [
    { label: "Model", value: "#8786867" },
    { label: "Style", value: "Classic style" },
    { label: "Certificate", value: "ISO-898921212" },
    { label: "Size", value: "34mm x 450mm x 19mm" },
    { label: "Memory", value: "36GB RAM" },
  ];

  const features = [
    "Some great feature name here",
    "Lorem ipsum dolor sit amet, consectetur",
    "Duis aute irure dolor in reprehenderit",
    "Some great feature name here",
  ];

  return (
    <div className="backGroung-white   p-4 my-4">
      <Tabs defaultActiveKey="description" id="product-tabs" className="mb-4 custom-tabs">
        
        <Tab eventKey="description" title="Description">
          <div className=" mb-4 text-muted" >
            <p >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam,
            </p>
            <p>
              Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

          <div style={{ maxWidth: "70%" }} className="mb-4">
            <Table bordered  className="m-0">
              <tbody>
                {specs.map((item, index) => (
                  <tr key={index}>
                    <td 
                      className=" text-muted px-3 py-2 bg-color-td" 
                      style={{ width: "35%"}}
                    >
                      {item.label}
                    </td>
                    <td 
                      className="text-muted px-3 py-2" 
                      
                    >
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex flex-column gap-2 text-muted" >
            {features.map((feature, index) => (
              <div key={index} className="d-flex align-items-center gap-2">
                <FaCheck className="text-muted" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Tab>

        <Tab eventKey="reviews" title="Reviews">
          <div className="p-3 text-muted"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, optio. Numquam, quae dolorem dicta quaerat illum aliquid nemo delectus alias labore veniam perspiciatis quis id itaque dignissimos exercitationem velit! Suscipit nihil pariatur aliquid reiciendis, magni deleniti officia a modi dicta.</p> </div>
        </Tab>

        <Tab eventKey="shipping" title="Shipping">
          <div className="p-3 text-muted"><p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt, ratione cupiditate sint aspernatur similique doloremque voluptatum quisquam voluptatem eaque facilis nam qui, nostrum officia harum recusandae fuga reprehenderit! In voluptates quaerat eveniet doloremque cum at adipisci sed accusamus esse? Pariatur iste maxime, explicabo voluptate obcaecati aliquam reprehenderit nemo, incidunt nam tenetur ipsum assumenda distinctio cum omnis dolor eveniet consequatur consequuntur!</p></div>
        </Tab>

        <Tab eventKey="seller" title="About seller">
          <div className="p-3 text-muted">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur voluptates autem odit magni! Odio nam maxime neque molestias dolores tenetur. Praesentium eius natus qui iste suscipit voluptatibus mollitia laboriosam quis?</div>
        </Tab>

      </Tabs>
    </div>
  );
};

export default ProductTabs;