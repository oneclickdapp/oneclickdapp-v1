import contract from './contracts/splitter/splitter';
var solc = require('solc');

function compile(contract) {
  console.log('input is a smart contract');
  var output = solc.compile(contract);
  console.log(JSON.stringify(output));
  output.contracts['splitter'].interface;
}

compile(contract);

<Accordion as={Card} link raised centered key={index}>
  <Card.Content textAlign="center">
    <Accordion.Title
      active={activeIndex === index}
      index={index}
      onClick={this.handleClick}
    >
      <Icon size="huge" circular name={item.icon} />
      <Header>{item.displayName}</Header>
    </Accordion.Title>
    <Accordion.Content active={activeIndex === index}>
      {this.renderPremiumFunctions(item.name, item.helperText)}
    </Accordion.Content>
  </Card.Content>
</Accordion>;
